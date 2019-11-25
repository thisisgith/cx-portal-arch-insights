import { Component, Input, OnChanges, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	SyslogsService,
	DeviceDetailsdata,
	ProductId,
	SoftwareList,
	ProductFamily,
	SyslogPanelGridData,
} from '@sdp-api';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { UserResolve } from '@utilities';

/**
 * Syslogpanelgrid component
 */

@Component({
	selector: 'syslog-message-details',
	styleUrls: ['./syslog-messages-details.component.scss'],
	templateUrl: './syslog-messages-details.component.html',
})
export class SyslogMessagesDetailsComponent implements OnChanges, OnDestroy {
	@Input('asset') public asset: any;
	@ViewChild('innerTableRef', { static: true }) public innerTableRef: TemplateRef<{ }>;
	@ViewChild('prodFamily', { static: true }) public prodFamily: TemplateRef<{ }>;
	@ViewChild('prodId', { static: true }) public prodId: TemplateRef<{ }>;
	@ViewChild('innerMessageType', { static: true }) public innerMessageType: TemplateRef<{ }>;
	@Input('selectedFilter') public selectedFilter: any;
	public tableOptions: CuiTableOptions;
	public innerTableOptions: CuiTableOptions;
	public selectDropDown = {
		assets: { },
		customerId: '',
		productFamily: '',
		productID: '',
		selectedFilters : { },
		Software: '',
		timePeriod: '',
	};

	public customerId;
	public tableData: DeviceDetailsdata[] = [];
	public fullResponse: SyslogPanelGridData;
	public productIdItems: ProductId[];
	public softwareItems: SoftwareList[];
	public productFamily: ProductFamily[];
	public pagerLimit = 5;
	public destroy$ = new Subject();
	public loading = false;
	public panelDataParam = {
		syslogId: '',
	};
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
	) {
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
	 * @param changes onchanges data
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges () {
		this.loadSyslogPaneldata(this.asset);
	}

	/**
	 * Used to load the table grid
	 * OnInit lifecycle hook
	 */

	public ngOnInit () {
		this.loadSyslogPaneldata(this.asset);
		// this.tableInitialization();
	}
	/**
	 * Used to  get the table grid
	 * @param asset gives table row info
	 */

	public loadSyslogPaneldata (asset) {
		this.loading = true;
		if (this.asset) {
			this.panelDataParam = {
				syslogId: asset.syslogId,
			};

			this.syslogsService.getPanelGridData(this.panelDataParam)
				.pipe(
					takeUntil(this.destroy$),
					catchError(err => {
						this.loading = false;
						this.logger
						.error('syslog-messages-details.component : getPanelGridData() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe((data: SyslogPanelGridData) => {
					this.loading = false;
					this.tableData = data.responseData;
				});

		}
	}

	/**
	 * on destroy
	 */

	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
