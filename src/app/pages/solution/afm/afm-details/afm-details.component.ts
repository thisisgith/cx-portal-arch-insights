import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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
export class AfmDetailsComponent implements OnInit, OnChanges {

	@Input('alarm') public alarm: Alarm;
	@Output()
	public selectedAsset = new EventEmitter();
	@Output() public eventUpdated = new EventEmitter();

	private destroyed$: Subject<void> = new Subject<void>();
	private destroy$ = new Subject();
	public searchParams: AfmSearchParams;
	public errorDesc: string;
	public options: any = { visible : false };
	public loading = false;

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
	 * Initialize on loading
	 */
	public ngOnInit () {
		this.errorDesc = '';
		this.eventUpdated.emit(false);
	}
	/**
	 * Initialize error description
	 */
	public ngOnChanges () {
		this.errorDesc = this.alarm.errorDesc;
		this.options.visible = false;
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
		this.loading = true;
		this.searchParams.customerId = alarmData.customerId;
		this.searchParams.faultIC = alarmData.faultIC;
		if (!alarmData.status || alarmData.status.toUpperCase() !== 'IGNORED') {
			this.afmService.ignoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.options = {
						alertIcon:  response.status.toUpperCase() === 'SUCCESS' ?
						'icon-check-outline' : 'icon-error-outline',
						message: response.statusMessage,
						severity: response.status.toUpperCase() === 'SUCCESS' ?
						 'alert--success' : 'alert--danger',
						visible: true,
					};
					if (response.status.toUpperCase() !== 'SUCCESS') {
						this.alarm.status = 'Success';
					} else {
						this.eventUpdated.emit(true);
					}
					this.loading = false;
				});
		} else {
			this.afmService.revertIgnoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.options = {
						alertIcon:  response.status.toUpperCase() === 'SUCCESS' ?
						'icon-check-outline' : 'icon-error-outline',
						message: response.statusMessage,
						severity: response.status.toUpperCase() === 'SUCCESS' ?
						 'alert--success' : 'alert--danger',
						visible: true,
					};
					if (response.status.toUpperCase() !== 'SUCCESS') {
						this.alarm.status = 'Ignored';
					} else {
						this.eventUpdated.emit(true);
					}
					this.loading = false;
				});
		}
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
