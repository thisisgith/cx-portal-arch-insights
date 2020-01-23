import { Component, Input, OnChanges, OnDestroy, ViewChild, TemplateRef, Output, EventEmitter, OnInit,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	SyslogsService,
	DeviceDetailsdata,
	ProductId,
	SoftwareList,
	ProductFamily,
	SyslogPanelGridData,
	SyslogCategoryList,
	PushToFaultResponse,
	SyslogCategoryData,
} from '@sdp-api';
import { catchError, takeUntil, map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { UserResolve } from '@utilities';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { User } from '@interfaces';
import { DetailsPanelStackService } from '@services';

/**
 * Syslogpanelgrid component
 */

@Component({
	selector: 'syslog-message-details',
	styleUrls: ['./syslog-messages-details.component.scss'],
	templateUrl: './syslog-messages-details.component.html',
})
export class SyslogMessagesDetailsComponent implements OnInit, OnChanges, OnDestroy {
	@Input('asset') public asset: any;
	@ViewChild('innerTableRef', { static: true }) public innerTableRef: TemplateRef<{ }>;
	@ViewChild('prodFamily', { static: true }) public prodFamily: TemplateRef<{ }>;
	@ViewChild('prodId', { static: true }) public prodId: TemplateRef<{ }>;
	@ViewChild('innerMessageType', { static: true }) public innerMessageType: TemplateRef<{ }>;
	@Input('selectedFilter') public selectedFilter: any;
	@Output('showSyslogsDetails') public showSyslogsDetails = new EventEmitter();
	@Output('showSuccess') public showSuccess = new EventEmitter();
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
	public count: number;
	public alert: any = { };
	public movetoAfmClicked = false;
	public moveToFaultParams = { };
	public categoryList: SyslogCategoryList[];
	public selectedCategory = '';
	public showAssetPanel = false;
	public fullscreen = false;
	public showAssetDetails = false;
	public currentUser: User;
	public moveToFaultsResponse: PushToFaultResponse;
	public currentUserFirstName = '';
	public currentUserEmail = '';
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
	) {
		this.userResolve.getCustomerId()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.customerId = id;
			});
		this.userResolve.getUser()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((user: User) => {
				this.currentUser = user;
				this.currentUserFirstName = this.currentUser.info.user.firstName;
				this.currentUserEmail = this.currentUser.info.user.emailId;
			});
	}

	/**
	 * Used to load the table grid
	 * @param changes onchanges data
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges () {
		this.loadSyslogPaneldata(this.asset);
		this.getCategoryList();
	}

	/**
	 * Used to load the table grid
	 * OnInit lifecycle hook
	 */

	public ngOnInit () {
		this.loadSyslogPaneldata(this.asset);
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
					map((data: SyslogPanelGridData) => {
						this.loading = false;
						this.tableData = data.responseData;
						this.count = data.count;
					}),
					catchError(err => {
						this.loading = false;
						_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
						this.logger
						.error('syslog-messages-details.component : getPanelGridData() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();

		}
	}

	/**
	 * toggles add note section
	 */
	public togglePushToFaults () {
		this.movetoAfmClicked = !this.movetoAfmClicked;
		this.selectedCategory = '';
	}

	/**
	 * Gets category list
	 */
	public getCategoryList () {
		this.loading = true;
		this.syslogsService
		.getSyslogsCategoryList()
		.pipe(takeUntil(this.destroy$),
		map((responseList: SyslogCategoryData) => {
			this.categoryList = responseList.responseData;
			this.loading = false;
		}), catchError(err => {
			this.loading = false;
			_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
			this.logger.error('syslogs-messagedetails.component : getGridData() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}))
		.subscribe();
	}

	/**
	 * Moveto fault
	 */
	public moveToFault () {
		this.moveToFaultParams = {
			neInstanceId: this.tableData[0].neInstanceId,
			signature:
			{
				syslogsignature : this.asset.msgType ,
				requestorname: this.currentUserFirstName,
				requestoremail: this.currentUserEmail,
				title: this.asset.msgType,
				category: this.selectedCategory,
			},
		};
		this.loading = true;
		this.syslogsService
		.getPushToFaultsInfo(this.moveToFaultParams)
		.pipe(takeUntil(this.destroy$),
		map((responseList: PushToFaultResponse) => {
			this.moveToFaultsResponse = responseList;
			this.loading = false;
			this.togglePushToFaults();
			this.showSuccess.emit(this.asset.msgType);
			this.onPanelClose();
		}), catchError(err => {
			this.loading = false;
			_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
			this.logger.error('syslogs-messagedetails.component : getGridData() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}))
		.subscribe();
	}

 /**
	 * Determines whether panel close on
	 */
	public onPanelClose () {
		this.detailsPanelStackService.reset();
		this.showAssetPanel = false;
		this.showAssetDetails = false;
		this.showSyslogsDetails.emit(false);
	}
	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
			this.showSyslogsDetails.emit(false);
			this.detailsPanelStackService.reset();
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
