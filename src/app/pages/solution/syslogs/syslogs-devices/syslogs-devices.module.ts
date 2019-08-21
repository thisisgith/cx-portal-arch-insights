import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import {  DetailsPanelModule } from '@components';
// tslint:disable-next-line: max-line-length
import { SyslogsDevicesDetailsModule } from '../syslogs-devices-details/syslogs-devices-details.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

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
		HttpClientModule,
		I18nPipeModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		SyslogsDataModule.forRoot({ rootUrl }),
		DetailsPanelModule,
		SyslogsDevicesDetailsModule,
	],
})
export class SyslogsDevicesModule { }
