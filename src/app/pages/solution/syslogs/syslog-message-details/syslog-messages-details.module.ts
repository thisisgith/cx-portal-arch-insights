import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyslogMessagesDetailsComponent } from './syslog-messages-details.component';
import { FormsModule } from '@angular/forms';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSelectModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsPanelModule, AssetDetailsModule, AssetDetailsHeaderModule } from '@components';

/**
 * Ng module
 */
@NgModule({
	declarations: [SyslogMessagesDetailsComponent],
	exports: [SyslogMessagesDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSelectModule,
		FormsModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CuiAlertModule,
		DetailsPanelModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
	],
})
export class SyslogMessagesDetailsModule { }
