import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureReviewComponent } from './architecture-review.component';
import { DevicesListModule } from './devices-list/devices-list.module';
import { DnacListModule } from './dnac-list/dnac-list.module';
import { ChartModule } from 'angular-highcharts';
import { CuiTabsModule, CuiSpinnerModule , CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { PieChartModule, VisualFilterBarModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { ArchitectureReviewModules } from '@sdp-api';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Child routes for OptimalSoftwareModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: ArchitectureReviewComponent,
		path: '',
	},
];

/** Module to represent the Architecture Review Component */
@NgModule({
	declarations: [ArchitectureReviewComponent],
	exports: [ArchitectureReviewComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		ChartModule,
		DevicesListModule,
		CuiTabsModule,
		DnacListModule,
		CuiTabsNavModule,
		PieChartModule,
		ArchitectureReviewModules.forRoot({ rootUrl }),
		CuiSpinnerModule,
		I18nPipeModule,
		VisualFilterBarModule,
	],
})
export class ArchitectureReviewModule { }
