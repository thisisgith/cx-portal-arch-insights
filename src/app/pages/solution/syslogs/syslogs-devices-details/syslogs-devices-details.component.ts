import { Component, Input, ViewChild,
	TemplateRef, OnChanges, OnDestroy } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService, DeviceMessageDescObject, SyslogDevice360Outer } from '@sdp-api';
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
	public tableOptions: CuiTableOptions;
	public tabledata: SyslogDevice360Outer[];
	public tabledata1: DeviceMessageDescObject[];
	public msgInclude = ' ';
	public msgExclude = ' ';
	public destroy$ = new Subject();
	public customerId;
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
		this.syslogdevice360data(this.asset);
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
	public syslogdevice360data (gridData) {
		this.syslogsService.getdevice360details(gridData, this.customerId)
		.pipe(takeUntil(this.destroy$),
		catchError(err => {
			this.logger.error('syslog-messages-details.component : getdevice360details() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}),
		)
		.subscribe((response: SyslogDevice360Outer[]) => {
			this.tabledata = response;
		});
	}

	/**
	 * on destroy
	 */

	public ngOnDestroy ( ) {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
