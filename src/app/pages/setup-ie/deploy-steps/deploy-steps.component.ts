import {
	Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, trigger, state, style, transition } from '@angular/animations';

import * as _ from 'lodash-es';

import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { KEY_CODES } from '@classes';
import { SetupStep } from '@interfaces';
import { SetupIEStateService } from '../setup-ie-state.service';

import { getSlides } from './slides.const';
import { Slide, SlideSet } from '../setup-ie.types';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Maps a SlideSet to an I18n string representation
 */
const tutorialTypeMap = {
	ie: I18n.get('_CiscoCXCollector_'),
	ova: I18n.get('_VSphere_'),
	vbox: I18n.get('_VirtualBox_'),
	vcenter: I18n.get('_VCenter_'),
};

/**
 * Component for showing OVA deploy steps
 */
@Component({
	animations: [
		trigger('fadeIn', [
			state('void', style({    opacity: 0  })),
			transition('void => *', animate(1000)),
		]),
	],
	selector: 'app-deploy-steps',
	styleUrls: ['./deploy-steps.component.scss'],
	templateUrl: './deploy-steps.component.html',
})
export class DeployStepsComponent implements SetupStep, OnChanges, OnDestroy, OnInit {
	@Input('inputs') public inputs: object;
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();

	private slideSet: SlideSet;
	private slideIndex = 0;
	public slides: Slide[];
	private destroy$: Subject<void> = new Subject<void>();

	public currentSlide: Slide;
	public title: string;
	public tutorialType;
	public stepLabel: string;
	public stepNum: number;

	constructor (
		private logger: LogService,
		private route: ActivatedRoute,
		private router: Router,
		private stateService: SetupIEStateService,
	) {
		this.logger.debug('DeployStepsComponent Created!');
	}

	/**
	 * Sets the tutorial type
	 */
	private setTutorialType () {
		this.tutorialType = tutorialTypeMap[this.slideSet];
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * NgOnInit
	 */
	public async ngOnInit () {
		const savedState = this.stateService.getState();
		const [slideSet, slideIndex] =
			this.extractDeploySteps(this.route.snapshot.queryParams.deployStepsSet);
		await this.router.navigate([], {
			queryParams: {
				deployStepsSet: `${slideSet || this.slideSet}:${slideIndex || this.slideIndex}`,
			},
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});
		this.route.queryParams
			.pipe(takeUntil(this.destroy$))
			.subscribe(params => {
				const [paramSlideSet, paramSlideIndex] = _.split(params.deployStepsSet, ':');
				if (paramSlideSet && paramSlideSet !== this.slideSet) {
					this.slideSet = paramSlideSet;
					const currentState = this.stateService.getState();
					this.slides = getSlides(this.slideSet, _.get(currentState, 'ovaSelection'));
					this.setTutorialType();
				}
				if (paramSlideIndex && paramSlideIndex !== this.slideSet) {
					this.slideIndex = paramSlideIndex;
				}
				if (this.slides) {
					this.currentSlide = this.slides[paramSlideIndex || 0];
					this.stepLabel = this.currentSlide.stepLabel;
					this.stepNum = this.currentSlide.stepNum;
				}
			});
		if (savedState && savedState.deployStepsSet) {
			const [cachedSlideSet, cachedSlideIndex] =
				this.extractDeploySteps(savedState.deployStepsSet);
			this.router.navigate([], {
				queryParams: {
					deployStepsSet: `${cachedSlideSet}:${cachedSlideIndex}`,
				},
				queryParamsHandling: 'merge',
				replaceUrl: true,
			});
		}
	}

	/**
	 * OnChanges lifecycle hook
	 * Update slides/title based on input type
	 */
	public ngOnChanges () {
		this.slideSet = _.get(this.inputs, 'slideSet', 'ova');
		const currentState = this.stateService.getState();
		this.slides = getSlides(this.slideSet, _.get(currentState, 'ovaSelection'));
		switch (this.slideSet) {
			case SlideSet.OVA:
				this.title = I18n.get('_DeployOVA_');
				break;
			case SlideSet.VCENTER:
				this.title = I18n.get('_DeployVCenter_');
				break;
			case SlideSet.VBOX:
				this.title = I18n.get('_DeployVBox_');
				break;
			case SlideSet.IE:
				this.title = I18n.get('_SetUpCXCollector_');
				break;
		}
		this.setTutorialType();
		this.currentSlide = this.slides[0];
	}

	/**
	 * Page to next slide on button click
	 */
	public async onNextSlide () {
		const index = this.slides.indexOf(this.currentSlide);
		if (index < this.slides.length - 1) {
			this.currentSlide = this.slides[index + 1];
			this.slideIndex = index;
			await this.router.navigate([], {
				queryParams: {
					deployStepsSet: `${this.slideSet}:${index + 1}`,
				},
				queryParamsHandling: 'merge',
			});
		} else {
			this.endTutorial();
		}
	}

	/**
	 * Skips the current deploy-steps component
	 */
	public async endTutorial () {
		await this.router.navigate([], {
			queryParams: {
				deployStepsSet: undefined,
			},
			queryParamsHandling: 'merge',
			replaceUrl: true,
			skipLocationChange: true,
		});
		this.onStepComplete.emit();
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (event.keyCode === KEY_CODES.ENTER) {
			this.onNextSlide();
		}
	}

	/**
	 * Extracts the deploy steps from a query string
	 * @param deployStepsSet {string}
	 * @returns array
	 */
	private extractDeploySteps (deployStepsSet: string) {
		const [slideSet, slideIndex] =
			_.split(deployStepsSet, ':');

		return [slideSet, slideIndex];
	}
}
