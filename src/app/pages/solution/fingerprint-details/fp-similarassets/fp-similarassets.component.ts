import {
	Component,
	Input,
	SimpleChanges,
	Output,
	EventEmitter,
	ViewChild,
	TemplateRef,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Subject } from 'rxjs';
import { FpIntelligenceService, SimilarDevicesList, RacetrackSolution, RacetrackTechnology } from '@sdp-api';
import {
	FormGroup,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { UserResolve } from '@utilities';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ActivatedRoute } from '@angular/router';
import { RacetrackInfoService } from '@services';

/**
 * fp-similarassets component
 */
@Component({
	selector: 'app-fp-similarassets',
	styleUrls: ['./fp-similarassets.component.scss'],
	templateUrl: './fp-similarassets.component.html',
})
export class FpSimilarAssetsComponent {
	@Input() public asset: any;
	public deviceId1 = '';
	public deviceId2 = '';
	public customerId: string;
	public deviceId: string;
	public deviceName: string;
	public serialNumber: string;
	public productId: string;
	public compareView: string;
	private destroyed$: Subject<void> = new Subject<void>();
	public tableOptions: CuiTableOptions;
	public seriesDataLoading = false;
	public page = 0;
	public size = 3;
	public similarityCriteria = 'softwares_features';
	public noData = false;
	public error = false;
	public requestForm: FormGroup = this.fb.group({
		similarityCriteria: ['softwares_features', Validators.required],
	});
	public similarDevicesData: SimilarDevicesList;
	public globalRiskRankValue;
	@Output() public devicesSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output() public reqError: EventEmitter<any> = new EventEmitter<any>();
	public selectedDevice2: any;
	@ViewChild('assetTemplate', { static: true })
	private assetTemplate: TemplateRef<[]>;
	@ViewChild('crashRiskTemplate', { static: true })
	private crashRiskTemplate: TemplateRef<[]>;
	@ViewChild('similarityMatchTemplate', { static: true })
	private similarityMatchTemplate: TemplateRef<[]>;
	@ViewChild('comparisonviewTemplate', { static: true })
	private comparisonviewTemplate: TemplateRef<[]>;
	@ViewChild('compareTemplate', { static: true })
	private compareTemplate: TemplateRef<[]>;
	@ViewChild('crashRiskAlignmentTemplate', { static: true })
	private crashRiskAlignmentTemplate: TemplateRef<[]>;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private userResolve: UserResolve,
		private fpIntelligenceService: FpIntelligenceService,
		private logger: LogService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.compareView = 'software';
	}
	public comparisonInfo = {
		customerId: this.customerId,
		deviceId1: ' ',
		deviceId2: ' ',
	};
	/**
	 * similarDeviceData
	 */
	public ngOnInit (): void {
		this.similarDevicesData = {
			customerId: this.customerId,
			count: 10,
			similarDevices: [],
		};
		this.similarDevicesGridInit();
		this.requestForm.valueChanges
			.pipe(debounceTime(1000))
			.subscribe(val => {
				if (this.requestForm.valid && this.isValidState) {
					this.page = 0;
					this.loadSimilarDevicesData();
				}
				this.logger.info(val);
			});
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnologyName = _.get(technology, 'name');
		});
	}

	/**
	 * Similar Devices grid init
	 */
	public similarDevicesGridInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'deviceId',
					name: I18n.get('_CP_SystemName_'),
					template: this.assetTemplate,
					sortable: false,
					width : '35%',
				},
				{
					key: 'similarityScore',
					name: I18n.get('_CP_SimilarityMatch_'),
					template: this.similarityMatchTemplate,
					sortable: false,
					width : '30%',
				},
				{
					headerTemplate: this.crashRiskAlignmentTemplate,
					key: 'riskScore',
					template: this.crashRiskTemplate,
					sortable: false,
					width : '16%',
				},
				{
					key: 'deviceId',
					name: '',
					template: this.compareTemplate,
					sortable: false,
					width : '20%',
				},
			],
			rowWellColor: 'black',
			rowWellTemplate: this.comparisonviewTemplate,
			dynamicData: true,
			singleSelect: true,
			striped: false,
			wrapText: true,
			padding: 'compressed',
		});
	}
	/**
	 * simlarDevicedata
	 * @param changes asset
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		this.deviceId = _.get(changes, ['asset', 'currentValue', 'deviceId'], null);
		this.deviceName = _.get(changes, ['asset', 'currentValue', 'deviceId']);
		this.serialNumber = _.get(changes, ['asset', 'currentValue', 'deviceId']);
		this.productId = _.get(changes, ['asset', 'currentValue', 'productId'], null);
		this.globalRiskRankValue = _.get(changes, ['asset', 'currentValue', 'globalRiskRank']);
		if (!_.get(changes, ['asset', 'firstChange'], false) && this.asset && this.isValidState) {
			this.loadSimilarDevicesData();
		}
	}

	/**
	 * Loads the list of devices matching the selected device based on filter criteria
	 */
	public loadSimilarDevicesData () {
		this.seriesDataLoading = true;
		const similarDeviceParams = this.getSimilarDeviceParams(
			this.requestForm.value,
		);
		similarDeviceParams.solution = this.selectedSolutionName;
		similarDeviceParams.useCase = this.selectedTechnologyName;
		this.fpIntelligenceService
			.getSimilarDevices(similarDeviceParams)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(
				similarDevicesData => {
					if (_.get(similarDevicesData, ['similarDevices', 'length'], 0) > 0) {
						this.similarDevicesData = similarDevicesData;
						this.noData = false;
						this.reqError.emit();
					} else {
						this.seriesDataLoading = false;
						this.noData = true;
						this.reqError.emit();
					}
				},
				err => {
					this.seriesDataLoading = false;
					this.noData = true;
					this.error = true;
					this.reqError.emit(I18n.get('_CP_SimilarAssets_Error_'));
					this.logger.error(err);
				},
				() => (this.seriesDataLoading = false),
			);
	}

	/**
	 * Fetches similar devices based on filter values
	 * @param filterValues filter options to get similar devices
	 * @returns params object to get similar devices
	 */
	public getSimilarDeviceParams (
		filterValues,
	): FpIntelligenceService.GetSimilarDevicesParams {
		return _.merge(
			{
				deviceId: this.deviceId,
				customerId: this.customerId,
				page: this.page,
				size: this.size,
			},
			filterValues,
		);
	}

	/**
	 * Determines whether table row selection on
	 * @param tableRowData contains table row data
	 */
	public onTableRowSelection (tableRowData: any) {
		if (tableRowData.active) {
			this.selectedDevice2 = tableRowData;
		}
	}
	/**
	 * onTableRow click
	 * @param rowData  table row
	 */
	public ontoggleRowSelect (rowData: any) {
		_.map(_.get(this.similarDevicesData, 'similarDevices'), row => {
			if (row.deviceId !== rowData.deviceId) {
				row.toggleWell = false;
			} else {
				rowData.toggleWell = !rowData.toggleWell;
			}
		});
		this.compareView = 'software';
	}

	/**
	 * On error event
	 * @param errorMsg Error Message
	 */
	public showError (errorMsg) {
		this.reqError.emit(errorMsg);
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	public get isValidState (): boolean {
	 return this.globalRiskRankValue !== 'LOW' &&
	  this.globalRiskRankValue !== 'Not Evaluated';
	}

}
