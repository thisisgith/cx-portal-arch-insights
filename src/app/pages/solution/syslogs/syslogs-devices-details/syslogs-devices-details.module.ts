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
import { SyslogsDeviceDetailsComponent } from './syslogs-devices-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
/**
 * Ng module
 */
@NgModule({
	declarations: [SyslogsDeviceDetailsComponent],
	exports: [SyslogsDeviceDetailsComponent],
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
