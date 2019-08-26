import { Component, Input, ViewChild,
	TemplateRef, OnChanges, OnDestroy } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService, DeviceMessageDescObject, SyslogDevicePanelOuter } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { UserResolve } from '@utilities';

/**
 * Device view component
 */
@Component({
	selector: 'syslogs-devices-details',
	styleUrls: ['./syslogs-devices-details.component.scss'],
	templateUrl: './syslogs-devices-details.component.html',
})
export class SyslogsDeviceDetailsComponent implements OnChanges, OnDestroy {
	@ViewChild('downArrow', { static: true }) public downArrow: TemplateRef<{ }>;
	@Input('asset') public asset: any;
	@Input('selectedFilter') public selectedFilter: any;
	public tableOptions: CuiTableOptions;
	public tabledata: SyslogDevicePanelOuter[];
	public tabledata1: DeviceMessageDescObject[];
	public destroy$ = new Subject();
	public customerId;
	public includeMsgFilter = '';
	public excludeMsgFilter = '';
	public selectedSeverity = '';
	public selectedTimeRange = '';
	public deviceDetailsParams: SyslogsService.GetSyslogsParams = { };
	public severityList = [
		{
			name: '0',
			value: 0,
		},
		{
			name: '1',
			value: 1,
		},
		{
			name: '2',
			value: 2,
		},
		{
			name: '3',
			value: 3,
		},
		{
			name: '4',
			value: 4,
		},
		{
			name: '5',
			value: 5,
		},
		{
			name: '6',
			value: 6,
		},
		{
			name: '7',
			value: 7,
		},
	];
	public timeRangeList = [
		{
			name: '1day',
			value: 1,
		},
		{
			name: '7days',
			value: 7,
		},
		{
			name: '15days',
			value: 15,
		},
		{
			name: '30days',
			value: 30,
		},
	];
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
	) {
		this.logger.debug('SyslogsDeviceDetailsComponent Created!');
		this.userResolve.getCustomerId()
			.pipe(
			takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.customerId = id;
			});
	}

	/**
	 * Used to load the table grid
		* @param changes contains changes
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges () {
		this.selectedTimeRange = this.selectedFilter.days;
		this.selectedSeverity = this.selectedFilter.severity;
		this.deviceDetailsParams = {
			customerId: this.customerId,
			days: +this.selectedTimeRange,
			deviceHost: this.asset.DeviceHost,
			excludeMsgType: this.excludeMsgFilter,
			includeMsgType: this.includeMsgFilter,
			severity: +this.selectedSeverity,
		};
		this.SyslogDevicePanelData();
	}

	/**
	 * Used to toggle the inner table
		* @param data event values
	 * Onchanges lifecycle hook
	 */
	public expandRow (data) {
		if (data.showMessage) {
			data.showMessage = false;
		} else {
			data.showMessage = true;
		}
	}
	/**
	 * Response from the network
		* @param gridData event values from input
	 * Onchanges lifecycle hook
	 */
	public SyslogDevicePanelData () {
		this.syslogsService.getdevicePanelDetails(this.deviceDetailsParams)
		.pipe(takeUntil(this.destroy$),
		catchError(err => {
			this.logger.error('syslog-messages-details.component : getdevicePanelDetails() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}),
		)
		.subscribe((response: SyslogDevicePanelOuter[]) => {
			this.tabledata = response;
		});
	}
	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public keyDownFunction (event) {
		if (event.keyCode === 13) {
			this.deviceDetailsParams.includeMsgType = this.includeMsgFilter;
			this.deviceDetailsParams.excludeMsgType = this.excludeMsgFilter;
			this.SyslogDevicePanelData();
		}
	}
	/**
	 * Determines whether selection on
	 */
	public onSelection () {
		this.deviceDetailsParams.severity = +this.selectedSeverity;
		this.deviceDetailsParams.days = +this.selectedTimeRange;
		this.SyslogDevicePanelData();
	}

	/**
	 * on destroy
	 */

	public ngOnDestroy ( ) {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
