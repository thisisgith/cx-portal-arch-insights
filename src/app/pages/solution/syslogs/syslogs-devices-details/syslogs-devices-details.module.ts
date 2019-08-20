import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSelectModule,
	CuiDrawersModule,
} from '@cisco-ngx/cui-components';
import { SyslogsdevicedetailsComponent } from './syslogs-devices-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
/**
 * Ng module
 */
@NgModule({
	declarations: [SyslogsdevicedetailsComponent],
	exports: [SyslogsdevicedetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSelectModule,
		CuiDrawersModule,
		FormsModule,
		ReactiveFormsModule,
		I18nPipeModule,
	],
})
export class SyslogsDevicesDetailsModule { }
