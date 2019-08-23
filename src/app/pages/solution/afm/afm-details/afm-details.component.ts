import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Alarm, AfmSearchParams, AfmService } from '@sdp-api';
import { Subject } from 'rxjs';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';

/**
 * Afm details panal header
 */
@Component({
	selector: 'afm-details',
	styleUrls: ['./afm-details.component.scss'],
	templateUrl: './afm-details.component.html',
})
export class AfmDetailsComponent {

	private destroyed$: Subject<void> = new Subject<void>();
	private destroy$ = new Subject();
	private searchParams: AfmSearchParams;
	public ignoreStatus: string;
	public errorDesc: string;

	@Input('alarm') public alarm: Alarm;
	@Output()
	public selectedAsset = new EventEmitter();

	constructor (
		private logger: LogService, private afmService: AfmService,
		private userResolve: UserResolve,
	) {
		this.logger.debug('AFM Detaisls Component Created!');
		this.searchParams = new Object();
		this.userResolve.getCustomerId()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.searchParams.customerId = id;
			});
	}

	/**
	 * Initialize error description
	 */
	public ngOnChanges () {
		this.errorDesc = this.alarm.errorDesc;
	}

	/**
	 * which will call asset details componet
	 * @param alarm -- alarm info
	 * @memberof AfmComponent
	 */
	public connectToAssetDetails (alarm: Alarm) {
		this.selectedAsset.emit(alarm);
	}

	/**
	 * Toggle Ignore event and revert Ignore Event
	 * @param alarmData Alarm
	 */
	public toggleEvent (alarmData: Alarm) {
		this.searchParams.customerId = alarmData.customerId;
		this.searchParams.faultIC = alarmData.faultIC;
		if (alarmData.status.toUpperCase() !== 'IGNORED') {
			this.afmService.ignoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.ignoreStatus = response.statusMessage;
				});
		} else {
			this.afmService.revertIgnoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.ignoreStatus = response.statusMessage;
				});
		}
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
