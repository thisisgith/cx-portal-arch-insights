import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SyslogsComponent } from './syslogs.component';
import { environment } from '@environment';
import { SyslogsDataModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiDropdownModule,
} from '@cisco-ngx/cui-components';
import { PieChartModule, DetailsPanelModule, ColumnChartModule } from '@components';
import { SyslogsMessagesModule } from './syslogs-messages/syslogs-messages.module';
import { SyslogsDevicesModule } from './syslogs-devices/syslogs-devices.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;
/**
 * Child routes for Syslog Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: SyslogsComponent,
		path: '',
	},
];

/**
 * Module representing the Syslog component of the Solution Page
 */
@NgModule({
	declarations: [SyslogsComponent],
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
		RouterModule.forChild(childRoutes),
		PieChartModule,
		DetailsPanelModule,
		SyslogsMessagesModule,
		SyslogsDevicesModule,
		ColumnChartModule,

	],
})
export class SyslogsModule { }
