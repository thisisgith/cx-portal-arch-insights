import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnChanges,
 } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Alarm, AfmSearchParams, AfmService, AfmResponse } from '@sdp-api';
import { Subject } from 'rxjs';
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
	public options: any = { visible : false };
	public loading = false;
	public status = false;

	constructor (private logger: LogService, private afmService: AfmService) {
		this.logger.debug('AFM Detaisls Component Created!');
		this.searchParams = new Object();
		this.status = false;
	}

	/**
	 * Initialize on loading
	 */
	public ngOnInit () {
		this.eventUpdated.emit(false);
		this.statusUpdate();
	}
	/**
	 * Initialize error description
	 * @param change SimpleChanges
	 */
	public ngOnChanges () {
		this.options.visible = false;
		this.statusUpdate();
	}

	/**
	 * Toogle event status update
	 */
	private statusUpdate () {
		if (!this.alarm || (this.alarm.status && this.alarm.status.toUpperCase() === 'IGNORED')) {
			this.status = true;
		} else {
			this.status = false;
		}
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
		this.options.visible = false;
		this.searchParams.customerId = alarmData.customerId;
		this.searchParams.faultIC = alarmData.faultIC;
		if (!alarmData.status || alarmData.status.toUpperCase() !== 'IGNORED') {
			this.afmService.ignoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.changeStatus('ignored', response, alarmData);
				});
		} else {
			this.afmService.revertIgnoreEvent(this.searchParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.changeStatus('revert', response, alarmData);
				});
		}
	}

	/**
	 * it will change the status of ignore event
	 *
	 * @private
	 * @param eventName name of event ignore/revert ignore
	 * @param response AfmResponse  of the operation
	 * @param alarmData alarmData
	 * @memberof AfmDetailsComponent
	 */
	private changeStatus (eventName: string, response: AfmResponse, alarmData: Alarm) {
		this.options = {
			alertIcon:  response.status.toUpperCase() === 'SUCCESS' ?
			'icon-check-outline' : 'icon-error-outline',
			message: response.statusMessage,
			severity: response.status.toUpperCase() === 'SUCCESS' ?
			 'alert--success' : 'alert--danger',
			visible: true,
		};
		if (response.status.toUpperCase() !== 'SUCCESS') {
			eventName === 'revert' ? this.status = true  : this.status = false;
		} else {
			this.eventUpdated.emit(true);
			if (eventName === 'revert') {
				 this.status = false ;
				 alarmData.status = 'Success';
			} else {
				this.status = true;
				alarmData.status = 'Ignored';
			}
		}
		this.loading = false;
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
