import {
	Component, EventEmitter, HostListener, Inject, Injectable, OnInit, OnDestroy, Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { SetupStep } from '@interfaces';
import { KEY_CODES } from '@classes';
import { SetupIEService } from '../setup-ie.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SetupIEStateService } from '../setup-ie-state.service';

/**
 * Window class (can be mocked in unit test)
 */
@Injectable()
export class WindowService {
	public location = location;
}

/**
 * Component to show instructions when DNAC is not detected
 */
@Component({
	selector: 'no-dnac',
	styleUrls: ['./no-dnac.component.scss'],
	templateUrl: './no-dnac.component.html',
})
export class NoDNACComponent implements OnDestroy, OnInit, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	public clickedGuideLink = false;
	public telemetryGuideUrl = this.env.ieSetup.telemetryGuideUrl;
	public loading: boolean;

	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		@Inject('ENVIRONMENT') private env,
		private router: Router,
		private setupService: SetupIEService,
		private state: SetupIEStateService,
		private window: WindowService,
	) { }

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.loading = true;
		this.setupService.checkForDNAC()
			.pipe(
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.subscribe(hasDNAC => {
				if (hasDNAC) {
					const state = this.state.getState();
					state.compKey = 7;
					this.state.setState(state);
					this.router.navigate([], {
						queryParams: {
							compKey: 7,
						},
						queryParamsHandling: 'merge',
					});
				}
			});
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (event.keyCode === KEY_CODES.ENTER && this.clickedGuideLink) {
			this.restartWizard();
		}
	}

	/**
	 * Restarts the wizard (user states DNAC is configured)
	 */
	public restartWizard () {
		this.window.location.reload();
	}

	/**
	 * Send user back to home page
	 */
	public goHome () {
		this.onStepComplete.emit();
	}
}
