import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
	ControlPointIEHealthStatusAPIService,
	ControlPointAdminSettingsAPIService,
	IEHealthStatusResponseModel,
	UserService,
	ControlPointIERegistrationAPIService,
} from '@sdp-api';
import { User } from '@interfaces';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

import { empty, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

import { I18n } from '@cisco-ngx/cui-utils';

import * as _ from 'lodash-es';
import { SetupIEStateService } from '../../setup-ie/setup-ie-state.service';
import * as moment from 'moment';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { IS_IE_OR_EDGE } from '@constants';

enum SystemInfo {
	OS_IMAGE = 0,
	KERNEL_VERSION = 1,
	DOCKER_RUNTIME_VERSION = 2,
	KUBERNETES_VERSION = 3,
}

enum MemoryUsage {
	CPU = 0,
	MEMORY = 1,
	DISK_SPACE = 2,
}

/**
 * Main Settings component
 */
@Component({
	providers: [
		AppStatusColorPipe,
		ResourceGaugeColorPipe,
	],
	selector: 'app-settings',
	styleUrls: ['./settings.component.scss'],
	templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
	@ViewChild('collectorReinstallModal',
		{ static: true }) private collectorReinstallModal: TemplateRef<string>;
	private destroyed$: Subject<void> = new Subject<void>();
	public cpData: IEHealthStatusResponseModel[];
	private customerId: string;
	public data = {
		component_details: [],
		dnac_details: [],
		ieStatus: '',
		ieVersion: '',
		lastUploadDate: '',
		memoryUsage: [
			{
				label: I18n.get('_CPUUtilization_'),
				percentage: 0,
				value: '',
			},
			{
				label: I18n.get('_MemoryUtilization_'),
				percentage: 100,
				value: '',
			},
			{
				label: I18n.get('_DiskSpaceUtilization_'),
				percentage: 0,
				value: '',
			},
		],
		systemInfo: [
			{
				label: I18n.get('_OSImage_'),
				value: '',
			},
			{
				label: I18n.get('_KernelVersion_'),
				value: '',
			},
			{
				label: I18n.get('_DockerRuntimeVersion_'),
				value: '',
			},
			{
				label: I18n.get('_KubernetesVersion_'),
				value: '',
			},
		],
	};

	public accepted = false;
	public error = false;
	public errorMessage = '';
	public loading = false;
	public insightTypeResp: any;
	public supportCaseInsightTypes = [];
	public regulatoryCompliance: object;
	public isLoading = false;
	public ieSetupCompleted = false;
	public lastDataSentStatus: string;

	private user: User;
	public params: NavigationExtras;
	public isIEOrEdge = IS_IE_OR_EDGE;

	constructor (
		private cuiModalService: CuiModalService,
		private controlPointIEHealthStatusAPIService: ControlPointIEHealthStatusAPIService,
		private route: ActivatedRoute,
		private userService: UserService,
		private controlPointInsightTypeAPIService: ControlPointAdminSettingsAPIService,
		private router: Router,
		private cpService: ControlPointIERegistrationAPIService,
		private state: SetupIEStateService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * Sets health status info given customerId.
	 * @param {String} customerId - Customer ID string
	 * @returns observable
	 */
	public getIEHealthStatusData (customerId: string) {
		return this.controlPointIEHealthStatusAPIService.getIEHealthStatusUsingGET(customerId)
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			);
	}

	/**
	 * Converts used and total strings to utilization percent
	 * @param {String} used - String w/ used resource info
	 * @param {String} total - String w/ total resource info
	 * @returns - Int representing used resources out of 100
	 */
	public getResourcePercent (used, total) {
		const usedNum = parseInt(used, 10);
		const totalNum = parseInt(total, 10);
		if (!usedNum || !totalNum) {
			return NaN;
		}

		return Math.ceil((usedNum / totalNum) * 100);
	}

	/**
	 * Gets units from resource strings
	 * @param resourceVal - String w/ resource info
	 * @returns - string containing unit represented
	 */
	public getUnits (resourceVal: string) {
		const results = resourceVal && resourceVal.match(/(\D+)/g);

		return results ? results[0] : undefined;
	}

	/**
	 * Converts free and total strings to free resources percent
	 */
	public handleData () {
		const component_details = _.get(this, 'cpData[0].component_details');
		const hardware_details = _.get(this, 'cpData[0].system_details.hardware_details');
		const os_details = _.get(this, 'cpData[0].system_details.os_details');

		this.data.component_details = _.map(
			component_details,
			app => this.prefixWithV(app, 'version'),
		);

		this.data.memoryUsage[MemoryUsage.CPU].percentage =
			_.parseInt(_.get(hardware_details, 'cpu_utilization'), 10);

		const freeMemory = _.get(hardware_details, 'free_memory');
		const totalMemory = _.get(hardware_details, 'total_memory');
		const memoryUnit = this.getUnits(freeMemory);

		const usedMemory = `${_.parseInt(totalMemory, 10) - _.parseInt(freeMemory, 10)}\
${memoryUnit}`;

		const freeHDD = _.get(hardware_details, 'free_hdd_size');
		const totalHDD = _.get(hardware_details, 'hdd_size');
		const HDDSizeUnit = this.getUnits(freeHDD);

		const usedHDD = `${_.parseInt(totalHDD, 10) - _.parseInt(freeHDD, 10)}\
${HDDSizeUnit}`;

		this.data.memoryUsage[MemoryUsage.MEMORY].percentage = this.getResourcePercent(
			usedMemory,
			totalMemory,
		);
		this.data.memoryUsage[MemoryUsage.MEMORY].value =
			usedMemory && totalMemory ?
				`${usedMemory} of ${totalMemory}` :
				I18n.get('_ErrorDisplayingData_');

		this.data.memoryUsage[MemoryUsage.DISK_SPACE].percentage =
			this.getResourcePercent(usedHDD, totalHDD);
		this.data.memoryUsage[MemoryUsage.DISK_SPACE].value =
			usedHDD && totalHDD ?
				`${usedHDD} of ${totalHDD}` :
				I18n.get('_ErrorDisplayingData_');

		this.data.systemInfo[SystemInfo.OS_IMAGE].value = _.get(os_details, 'osImage');
		this.data.systemInfo[SystemInfo.KERNEL_VERSION].value = _.get(os_details, 'kernelVersion');
		this.data.systemInfo[SystemInfo.DOCKER_RUNTIME_VERSION].value =
			_.get(os_details, 'containerRuntimeVersion');
		this.data.systemInfo[SystemInfo.KUBERNETES_VERSION].value =
			_.get(os_details, 'kubeletVersion');

		this.data.lastUploadDate = _.get(this, 'cpData[0].lastUploadDate');
		this.getlastUploadDate();
		this.data.ieStatus = _.get(this, 'cpData[0].ieStatus');
		this.data.ieVersion = _.get(this, 'cpData[0].ie_version');
		this.prefixWithV(this.data, 'ieVersion');

		this.data.dnac_details = _.get(this, 'cpData[0].dnac_details');
		if (this.data.dnac_details && this.data.dnac_details[0]) {
			this.prefixWithV(this.data.dnac_details[0], 'version');
		}
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.loading = true;
		this.getIEHealthStatusData(this.customerId)
			.subscribe(response => {
				this.cpData = response;
				this.handleData();
			});
		this.getInsightType(this.customerId, 'ALL')
			.subscribe(response => {
				this.insightTypeResp = response;

				this.insightTypeResp.insightConfigs.forEach(insightConf => {
					if (insightConf.insightType === 'COMPLIANCE') {
						this.regulatoryCompliance = insightConf;
					} else if (insightConf.insightType === 'RPR') {
						this.supportCaseInsightTypes.push(insightConf);
					}
				});
			});
		this.cpService.getIESetupCompletionStatusUsingGET(this.customerId)
			.pipe(
				catchError(() => empty()),
				takeUntil(this.destroyed$),
			)
			.subscribe(res => {
				this.ieSetupCompleted = res.ieSetupCompleted;
			});
	}

	/**
	 * Prefixes a 'v' to some field in a provided object
	 * @param obj {object}
	 * @param field {string}
	 * @returns object
	 */
	private prefixWithV (obj: object, field: string) {
		if (!/^v/.test(obj[field]) && obj[field]) {
			obj[field] = `v${obj[field]}`;
		}

		return obj;
	}

	/**
	 * Sets health status info given customerId.
	 * @param customerId - Customer ID string
	 * @param insightType - string
	 * @returns observable
	 */
	public getInsightType (customerId: string, insightType: string) {
		return this.controlPointInsightTypeAPIService
			.getUserPreferenceDetailsUsingGET({ customerId, insightType })
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			);
	}

	/**
	 * Changes insight mode
	 * @param insightType - string
	 * @param mode - string
	 * @returns observable
	 */
	public insightModeChange (insightType, mode) {
		this.isLoading = true;
		const parameters = {
			insightType,
			mode,
			customerId: this.customerId,
		};

		return this.controlPointInsightTypeAPIService
			.createUserPreferenceDetailsUsingPOST(parameters)
			.subscribe(() => {
				this.isLoading = false;
			});
	}

	/**
	 * Function to navigate to set up
	 */
	public navigateTosetup () {
		this.state.clearState();
		this.params = { queryParams: { fromAdmin: true } };
		this.cuiModalService.show(this.collectorReinstallModal, 'normal');
	}

	/**
	 * Function to get last Upload timestamps
	 */
	public getlastUploadDate () {
		const lastUploadDate = moment(this.data.lastUploadDate);
		const currentUTCTime = moment((new Date()).toUTCString())
		.utc()
		.format('YYYY-MM-DDTHH:mm:ss.SSSS');
		const timeDifferenceinHours = moment(currentUTCTime)
		.diff(lastUploadDate, 'hours');
		const timeDifferenceinMinutes = moment(currentUTCTime)
		.diff(lastUploadDate, 'minutes');
		this.lastDataSentStatus = timeDifferenceinHours > 24 ? `${moment(currentUTCTime)
		.diff(lastUploadDate, 'days')} days ago` : timeDifferenceinHours === 0 ?
		 `${timeDifferenceinMinutes} minutes ago` : `${timeDifferenceinHours} hours ago`;

	}

	/**
	 * Function to continue to setup
	 */
	public onContinue () {
		this.router.navigate(['/setup-ie'], this.params);

	}

}
