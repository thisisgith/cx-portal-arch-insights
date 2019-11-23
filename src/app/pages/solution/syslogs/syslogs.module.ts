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
import {
	PieChartModule,
	DetailsPanelModule,
	ColumnChartModule,
	VisualFilterBarModule,
} from '@components';
import { SyslogsMessagesModule } from './syslogs-messages/syslogs-messages.module';
import { InsightTabsModule } from 'src/app/components/insight-tabs/insight-tabs.module';
import { FaultsModule } from './faults/faults.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
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
		ColumnChartModule,
		VisualFilterBarModule,
		InsightTabsModule,
		FaultsModule,
	],
})
export class SyslogsModule { }
