import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptimalSoftwareVersionComponent } from './osv.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { Panel360Module } from '@components';
import { AssetDetailsModule } from './asset-detail/asset-detail.module';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { AssetsPieChartModule } from './assets-pie-chart/assets-pie-chart.module';
import { ProfileGroupsModule } from './profile-groups/profile-groups.module';
import { AssetsModule } from './assets/assets.module';
import { SoftwareVersionsModule } from './software-versions/software-versions.module';
import { ProfileGroupDetailModule } from './profile-group-detail/profile-group-detail.module';
import { environment } from '@environment';
import { OSVModule } from '@sdp-api';
import { AssetTimelineChartModule } from './asset-timeline-chart/asset-timeline-chart.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Child routes for OptimalSoftwareModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: OptimalSoftwareVersionComponent,
		path: '',
	},
];

/**
 * Module representing the OptimalSoftwareComponent of the BestPractices Page
 */
@NgModule({
	declarations: [OptimalSoftwareVersionComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		Panel360Module,
		CuiTabsModule,
		AssetDetailsModule,
		CuiSpinnerModule,
		FormsModule,
		AssetsPieChartModule,
		ProfileGroupsModule,
		AssetsModule,
		SoftwareVersionsModule,
		ProfileGroupDetailModule,
		OSVModule.forRoot({ rootUrl }),
		AssetTimelineChartModule,

	],
})
export class OptimalSoftwareVersionModule { }
