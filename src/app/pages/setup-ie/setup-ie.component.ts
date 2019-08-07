import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LogService } from '@cisco-ngx/cui-services';

import { SetupComponent, SetupStep } from '@interfaces';
import { SETUP_STATES } from '@classes';
import { BeginInstallationComponent } from './begin-installation/begin-installation.component';
import { SelectInstructionsComponent } from './select-instructions/select-instructions.component';
import { getSlides } from './select-instructions/slide-getter.function';
import { IESetupWizardState, SetupIEStateService } from './setup-ie-state.service';
import { Selection } from './setup-ie.types';

import { CuiModalService } from '@cisco-ngx/cui-components';
import { ResetCacheModal } from './reset-cache-modal/reset-cache-modal.component';
import { SetupIEService } from './setup-ie.service';
import { UtilsService } from '@services';
import { NoDNACComponent } from './no-dnac/no-dnac.component';
import * as _ from 'lodash-es';

/**
 * Default initial steps
 */
const defaultSteps = [
	{
		state: SETUP_STATES.INIT,
		type: BeginInstallationComponent,
	},
	{
		state: SETUP_STATES.INIT,
		type: SelectInstructionsComponent,
	},
];

/**
 * Main setup page. Engine icons on the left column and dynamic components on the right.
 */
@Component({
	selector: 'app-setup-ie',
	styleUrls: ['./setup-ie.component.scss'],
	templateUrl: './setup-ie.component.html',
})
export class SetupIeComponent implements AfterViewInit, OnInit, OnDestroy {
	@ViewChild('componentContainer', { read: ViewContainerRef, static: true }) private container:
		ViewContainerRef;
	public activeComponent: ComponentRef<SetupStep>;
	public currentStep = 0;
	public steps: SetupComponent[] = defaultSteps;
	private destroy$ = new Subject();
	public savedState: IESetupWizardState;
	public loading: boolean;

	constructor (
		@Inject('ENVIRONMENT') private env,
		private cdr: ChangeDetectorRef,
		private cuiModalService: CuiModalService,
		private resolver: ComponentFactoryResolver,
		private router: Router,
		private logger: LogService,
		private route: ActivatedRoute,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
		private utils: UtilsService,
	) {
		this.logger.debug('SetupIeComponent Created!');
	}

	/**
	 * AfterViewInit {
	 *
	 */
	public async ngAfterViewInit () {
		if (this.savedState) {
			this.promptToReuseCache();
			this.cdr.detectChanges();
		}
	}

	/**
	 * Prompts user to reuse the saved state
	 */
	private async promptToReuseCache () {
		// this takes user back to last step they were on if a state exists in localStorage
		const useSavedState = await this.cuiModalService.showComponent(ResetCacheModal, { });
		if (useSavedState) {
			this.router.navigate([], {
				queryParams: {
					..._.omit(this.savedState, ['collectorToken']),
				},
				queryParamsHandling: 'merge',
				replaceUrl: true,
			});
		} else {
			this.router.navigate([], {
				queryParams: {
					compKey: '0',
				},
				replaceUrl: true,
			});
		}

	}

	/**
	 * Init lifecycle hook
	 */
	public ngOnInit () {
		this.savedState = this.state.getState() || { };
		this.route.queryParams
			.pipe(takeUntil(this.destroy$))
			.subscribe(params => {
				const compKey = params.compKey;
				const ovaSelection = params.ovaSelection;

				this.setOvaSelection(ovaSelection);

				let shouldReuseComponent = false;
				if (isNaN(compKey)) {
					this.currentStep = 0;
				} else if (compKey >= this.steps.length) {
					// if compKey is greater than last step, go to last
					this.currentStep = this.steps.length - 1;
				} else {
					const stepNumber = Number(compKey);
					if (this.currentStep !== stepNumber || stepNumber === 0) {
						this.currentStep = stepNumber;
					} else {
						shouldReuseComponent = true;
					}
				}

				if (!shouldReuseComponent) {
					this.createComponent(this.steps[this.currentStep]);
				}

				if (this.currentStep !== 0) {
					const state = this.state.getState() || { };
					state.ovaSelection = ovaSelection;
					state.compKey = this.currentStep;
					state.deployStepsSet = params.deployStepsSet;
					this.state.setState(state);
				} else {
					this.state.clearState();
				}
			});
	}

	/**
	 * Sets the steps given an ova selection
	 * @param ovaSelection {Selection}
	 */
	public setOvaSelection (ovaSelection: Selection) {
		if (ovaSelection) {
			this.steps = [
				...defaultSteps,
				...(getSlides(ovaSelection) || []),
			];
			const noDNAC = this.utils.getLocalStorage(this.env.ieSetup.DNAC_LS_KEY);
			if (noDNAC) {
				this.steps.push({
					state: SETUP_STATES.COLLECTOR,
					type: NoDNACComponent,
				});
			}
		}
	}

	/**
	 * Destroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.container.clear();
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Dynamically create a component
	 * @param step Object representing the component type/inputs to create the component instance
	 */
	private createComponent (step: SetupComponent) {
		this.container.clear();
		const factory: ComponentFactory<SetupStep> =
			this.resolver.resolveComponentFactory(step.type);
		this.activeComponent = this.container.createComponent(factory);
		if (step.inputs) {
			this.activeComponent.instance.inputs = step.inputs;
			this.activeComponent.instance.ngOnChanges();
		}
		if (!this.activeComponent || ! this.activeComponent.instance) { return; }
		this.activeComponent.instance.onStepComplete
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(newSteps => {
				if (newSteps) {
					// If one set of slides is loaded, but user goes back, clear the list of slides
					if (this.currentStep < 2 && this.steps.length > 2) {
						this.steps = this.steps.slice(0, 2);
					}
					this.steps = this.steps.concat(newSteps);
				}
				if (this.currentStep < (this.steps.length - 1)) {
					const nextStep = Number(this.currentStep) + 1;
					this.router.navigate([], {
						queryParams: {
							compKey: nextStep,
						},
						queryParamsHandling: 'merge',
					});
				} else {
					this.router.navigate(['/'], {
						queryParams: { },
					});
				}
			});
	}
}