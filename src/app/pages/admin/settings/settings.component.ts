import { Component, OnInit } from '@angular/core';
import {
	ControlPointIEHealthStatusAPIService,
	IEHealthStatusResponseModel,
	UserService,
} from '@sdp-api';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

import { empty, Subject } from 'rxjs';
import { catchError, finalize, takeUntil, mergeMap } from 'rxjs/operators';

import { I18n } from '@cisco-ngx/cui-utils';

import * as _ from 'lodash-es';

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
export class SettingsComponent  implements OnInit {
	private destroyed$: Subject<void> = new Subject<void>();
	public cpData: IEHealthStatusResponseModel[];
	private customerId: string;
	public data = {
		component_details: [],
		dnac_details: [],
		ieStatus: '',
		ieVersion: '',
		memoryUsage: [
			{
				label: I18n.get('_CurrentCPUUtilization_'),
				percentage: 0,
				value: '',
			},
			{
				label: I18n.get('_CurrentAvailableMemory_'),
				percentage: 100,
				value: '',
			},
			{
				label: I18n.get('_FreeDiskSpace_'),
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

	constructor (
		private controlPointIEHealthStatusAPIService: ControlPointIEHealthStatusAPIService,
		private userService: UserService,
	) { }

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
	 * Converts free and total strings to free resources percent
	 * @param {String} free - String w/ free resource info
	 * @param {String} total - String w/ total resource info
	 * @returns - Int representing free resources out of 100
	 */
	public getResourcePercent (free, total) {
		const freeNum = parseInt(free, 10);
		const totalNum = parseInt(total, 10);
		if (!freeNum || !totalNum) {
			return NaN;
		}

		return Math.ceil((freeNum / totalNum) * 100);
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
		const freeHDD = _.get(hardware_details, 'free_hdd_size');
		const totalHDD = _.get(hardware_details, 'hdd_size');
		this.data.memoryUsage[MemoryUsage.MEMORY].percentage = this.getResourcePercent(
			freeMemory,
			totalMemory,
		);
		this.data.memoryUsage[MemoryUsage.MEMORY].value = `${freeMemory} of ${totalMemory}`;

		this.data.memoryUsage[MemoryUsage.DISK_SPACE].percentage =
			this.getResourcePercent(freeHDD, totalHDD);
		this.data.memoryUsage[MemoryUsage.DISK_SPACE].value = `${freeHDD} of ${totalHDD}`;

		this.data.systemInfo[SystemInfo.OS_IMAGE].value = _.get(os_details, 'osImage');
		this.data.systemInfo[SystemInfo.KERNEL_VERSION].value = _.get(os_details, 'kernelVersion');
		this.data.systemInfo[SystemInfo.DOCKER_RUNTIME_VERSION].value =
			_.get(os_details, 'containerRuntimeVersion');
		this.data.systemInfo[SystemInfo.KUBERNETES_VERSION].value =
			_.get(os_details, 'kubeletVersion');

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
		this.userService.getUser()
			.pipe(
				catchError(err => {
					this.error = true;
					this.errorMessage = err.message;

					return empty();
				}),
				finalize(() => this.loading = false),
				takeUntil(this.destroyed$),
			)
			.pipe(
				mergeMap(userResponse =>
					this.getIEHealthStatusData(String(_.get(userResponse, 'data.customerId')))),
			)
			.subscribe(response => {
				this.cpData = response;
				this.handleData();
			});
	}

	/**
	 * Prefixes a 'v' to some field in a provided object
	 * @param obj {object}
	 * @param field {string}
	 * @returns object
	 */
	private prefixWithV (obj: object, field: string) {
		if (!/^v/.test(obj[field])) {
			obj[field] = `v${obj[field]}`;
		}

		return obj;
	}
}
