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
export class SyslogsdevicedetailsComponent implements OnChanges, OnDestroy {
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
		this.logger.debug('SyslogsdevicedetailsComponent Created!');
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
		* @param griddata event values from input
	 * Onchanges lifecycle hook
	 */
	public syslogdevice360data (griddata) {
		this.syslogsService.getdevice360details(griddata, this.customerId)
		.pipe(takeUntil(this.destroy$))
		.subscribe(response => {
			this.tabledata = response;
		});
		catchError(err => {
			this.logger.error('syslog-messages-details.component : getdevice360details() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
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
