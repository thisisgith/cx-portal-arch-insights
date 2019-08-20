import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService,
	DeviceDetailsdata,
	ProductId,
	SoftwareList,
	ProductFamily,
	Syslog360GridData } from '@sdp-api';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { I18n } from '@cisco-ngx/cui-utils';
import { UserResolve } from '@utilities';

/**
 * Syslog360grid component
 */

@Component({
	selector: 'syslog-message-details',
	styleUrls: ['./syslog-messages-details.component.scss'],
	templateUrl: './syslog-messages-details.component.html',
})
export class SyslogmessagesdetailsComponent implements OnChanges, OnDestroy {
	@Input('asset') public asset: Syslog360GridData;
	public tableOptions: CuiTableOptions;
	public selectdrowpdown = {
		productFamily: '',
		productID: '',
		Software: '',
		timePeriod: '',
	};
	public customerId;
 	public tabledata1: DeviceDetailsdata[] = [];
	public tableOffset = 0;
	public productIdItems: ProductId[];
	public softwareItems: SoftwareList[];
	public productFamily: ProductFamily[];
	public totalItems = 0;
	public tableLimit = 5;
	public pagerLimit = 5;
	public destroy$ = new Subject();
	// tslint:disable-next-line: no-any
	public timePeriod: any[] = [{
		name: '24hr',
	},
	{
		name: '7d',
	},
	{
		name: '15d',
	},
	{
		name: '30d',
	}];
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
	 * @param changes onchanges data
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges () {
		this.loadSyslog360data(this.asset);
		this.loadSyslog360filter(this.asset);
	}

	/**
	 * Used to load the table grid
	 * OnInit lifecycle hook
	 */

	public ngOnInit () {
		this.tableInitialization();
	}
	/**
	 * Used to load the table grid
	 * Cui table values
	 */
	public tableInitialization ( ) {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			dynamicData: false,
		// tslint:disable-next-line: object-literal-sort-keys
			columns: [
				{
					key: 'DeviceHost',
					name: I18n.get('_Asset_'),
					sortable: true,
				},
				{
					key: 'SyslogMsgDesc',
					name: I18n.get('_Message_'),
					sortable: true,
				},
				{
					key: 'ProductId',
					name: I18n.get('_ProductID_'),
					sortable: true,
				},
				{
					key: 'ProductFamily',
					name: I18n.get('_ProductFamily_'),
					sortable: true,
				},
				{
					key: 'SoftwareType',
					name: I18n.get('_Software_'),
					sortable: true,
				},
				{
					key: 'SoftwareVersion',
					name: I18n.get('_SoftwareVersion_'),
					sortable: true,
				},
				{
					key: 'msgCount',
					name: I18n.get('_Count_'),
					sortable: true,
				},
			],
		});
	}
	/**
	 * Used to  Filter the table grid
	 */

	public onSelection () {
		this.syslogsService
		.get360FilterGridData(
			this.selectdrowpdown, this.asset)
			.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.tabledata1 = data.responseData;
		});
		catchError(err => {
			this.logger.error('syslog-messages-details.component : get360FilterGridData() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		});
	}

	/**
	 * Used to  get the table grid
	 * @param tablerowdata gives table row info
	 */

	public loadSyslog360data (tablerowdata) {
		if (this.asset) {
			this.syslogsService.get360GridData(tablerowdata, this.customerId)
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.tabledata1 = data.responseData;
		});
			catchError(err => {
				this.logger.error('syslog-messages-details.component : get360GridData() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			});
		}
	}

	/**
	 * Used to  get the filter data grid
	 * @param tablerowdata gives table row info
	 */

	public loadSyslog360filter (tablerowdata) {
		if (this.asset) {
			this.syslogsService.get360FilterData(tablerowdata)
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.productFamily = data.responseData[2].ProductFamily;
			this.productIdItems = data.responseData[0].ProductId;
			this.softwareItems = data.responseData[1].SoftwareType;
		});
			catchError(err => {
				this.logger.error('syslog-messages-details.component : get360FilterData() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			});
		}
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
	}

	/**
	 * on destroy
	 */

	public ngOnDestroy ( ) {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
