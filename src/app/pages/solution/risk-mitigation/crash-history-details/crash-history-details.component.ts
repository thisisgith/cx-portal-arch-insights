import {
	Component,
	OnChanges,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	ViewChild,
	TemplateRef,
	OnDestroy,
} from '@angular/core';
import { DetailsPanelStackService } from '@services';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { RiskMitigationService } from '@sdp-api';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Details view for a Crashed System
 */
@Component({
	selector: 'app-crash-history-details',
	templateUrl: './crash-history-details.component.html',
})
export class CrashHistoryDetailsComponent implements OnChanges, OnDestroy {
	@Input() public selectedSystem = '';
	@Output('close') public close = new EventEmitter<boolean>();
	public fullscreen = false;
	public showAssetDetailsView = false;
	public crashHistoryLoading = false;
	public crashHistoryGridOptions: CuiTableOptions;
	public crashHistoryGridDetails = {
		tableData: [],
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 0,
	};
	private destroy$ = new Subject();
	@ViewChild('resetReasonTemplate', { static: true })
	public resetReasonTemplate: TemplateRef<string>;
	@ViewChild('softwareVersionTemplate', { static: true })
	public softwareVersionTemplate: TemplateRef<string>;
	@ViewChild('timeStampTemplate', { static: true })
	public timeStampTemplate: TemplateRef<string>;
	public customerId: any;
	public crashHistoryParams: { customerId: any; neInstanceId: any; };

	constructor (
		private detailsPanelStackService: DetailsPanelStackService,
		private riskMitigationService: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.crashHistoryGridInit();
	}

	/**
	 * Update changes to selectedSystem
	 * @param changes data of OnChages Object
	 */
	public ngOnChanges (changes: SimpleChanges) {
		this.selectedSystem = _.get(
			changes,
			'selectedSystem.currentValue',
			this.selectedSystem,
		);
		this.getCrashedDeviceHistory(this.selectedSystem);
	}

	/**
	 * close panel 360
	 */
	public onPanelClose () {
		this.detailsPanelStackService.reset();
		this.selectedSystem = '';
		this.close.emit(true);
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden () {
		this.selectedSystem = '';
		this.onPanelClose();
		this.onAllPanelsClose();
	}

	/**
	 * Closes all 360 panels
	 */
	public onAllPanelsClose () {
		this.detailsPanelStackService.reset();
	}

	/**
	 * on init of component build tables
	 */
	public crashHistoryGridInit () {
		this.crashHistoryGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'resetReason',
					name: I18n.get('_RMRessetReason_'),
					sortable: false,
					template: this.resetReasonTemplate,
					width: '60%',
				},
				{
					key: 'timeStamp',
					name: I18n.get('_RMTimeStamp_'),
					sortable: false,
					template: this.timeStampTemplate,
					width: '40%',
				},
			],
		});
	}

	/**
	 * Gets crashed device history
	 * @param asset has the data of selected crashed details
	 * @returns  Returns the particular device crash history data
	 */
	private getCrashedDeviceHistory (asset) {
		this.crashHistoryGridDetails.tableData = [];
		this.crashHistoryLoading = true;
		this.crashHistoryParams = {
			customerId: _.cloneDeep(this.customerId),
			neInstanceId: asset.neInstanceId,
		};

		return this.riskMitigationService.getCrashHistoryForDevice(this.crashHistoryParams)
							.pipe(
								takeUntil(this.destroy$),
								map((results: any) => {
									this.crashHistoryGridDetails.tableData = results.crashes;
									this.crashHistoryLoading = false;
								}),
								catchError(err => {
									this.crashHistoryGridDetails.tableData  = [];
									this.crashHistoryLoading = true;
									this.logger.error('Crash Assets : getCrashedDeviceHistory() ' +
										`:: Error : (${err.status}) ${err.message}`);

									return of({ });
								}),
							)
							.subscribe();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
