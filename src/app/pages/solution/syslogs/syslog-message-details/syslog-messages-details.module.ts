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
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

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
	],
})
export class SyslogMessagesDetailsModule { }
