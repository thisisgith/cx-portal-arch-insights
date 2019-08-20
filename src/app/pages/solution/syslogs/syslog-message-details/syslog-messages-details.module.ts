import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyslogmessagesdetailsComponent } from './syslog-messages-details.component';
import { FormsModule } from '@angular/forms';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSelectModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Ng module
 */
@NgModule({
	declarations: [SyslogmessagesdetailsComponent],
	exports: [SyslogmessagesdetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSelectModule,
		FormsModule,
		I18nPipeModule,
	],
})
export class SyslogmessagesdetailsModule { }
