import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SyslogsDevicesComponent } from './syslogs-devices.component';
import { environment } from '@environment';
import { SyslogsDataModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiDropdownModule,
} from '@cisco-ngx/cui-components';
import { DetailsPanelModule, AssetDetailsModule, AssetDetailsHeaderModule } from '@components';
import {
	SyslogsDevicesDetailsModule,
} from '../syslogs-devices-details/syslogs-devices-details.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing the Syslog component of the Solution Page
 */
@NgModule({
	declarations: [SyslogsDevicesComponent],
	exports: [SyslogsDevicesComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CuiDropdownModule,
		I18nPipeModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		SyslogsDataModule.forRoot({ rootUrl }),
		DetailsPanelModule,
		SyslogsDevicesDetailsModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
	],
})
export class SyslogsDevicesModule { }
