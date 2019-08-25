import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptimalSoftwareVersionComponent } from './osv.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetDetailsModule } from './asset-detail/asset-detail.module';
import { CuiTabsModule, CuiSpinnerModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { AssetsModule } from './assets/assets.module';
import { SoftwareVersionsModule } from './software-versions/software-versions.module';
import { environment } from '@environment';
import { OSVModule } from '@sdp-api';

import { DetailsPanelModule, PieChartModule } from '@components';
import { SoftwareGroupsModule } from './software-groups/software-groups.module';
import { ContactExpertModule } from '../contact-expert/contact-expert.module';
import { SoftwareGroupDetailModule } from './software-group-detail/software-group-detail.module';

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
		DetailsPanelModule,
		CuiTabsModule,
		CuiSpinnerModule,
		FormsModule,
		PieChartModule,
		CuiModalModule,
		OSVModule.forRoot({ rootUrl }),
		AssetsModule,
		AssetDetailsModule,
		SoftwareVersionsModule,
		SoftwareGroupsModule,
		SoftwareGroupDetailModule,
		ContactExpertModule,
	],
})
export class OptimalSoftwareVersionModule { }
