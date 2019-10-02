import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SyslogsMessagesComponent } from './syslogs-messages.component';
import { environment } from '@environment';
import { SyslogsDataModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiDropdownModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { DetailsPanelModule, AssetDetailsModule, AssetDetailsHeaderModule } from '@components';
import { SyslogMessagesDetailsModule,
} from '../syslog-message-details/syslog-messages-details.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;
/**
 * Child routes for Syslog Module for lazy loading
 */

/**
 * Module representing the Syslog component of the Solution Page
 */
@NgModule({
	declarations: [SyslogsMessagesComponent],
	exports: [SyslogsMessagesComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
		CuiDropdownModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		SyslogsDataModule.forRoot({ rootUrl }),
		SyslogMessagesDetailsModule,
		DetailsPanelModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
		CuiSpinnerModule,
	],
})
export class SyslogsMessagesModule { }
