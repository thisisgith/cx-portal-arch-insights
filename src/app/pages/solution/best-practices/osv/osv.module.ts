import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptimalSoftwareVersionComponent } from './osv.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { Panel360Module } from '@components';
import { AssetSoftwareDetailsModule } from './asset-software-detail/asset-software-detail.module';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { AssetsSoftwarePieChartModule } from './assets-pie-chart/assets-software-pie-chart.module';
import { ProfileGroupsModule } from './profile-groups/profile-groups.module';
import { AssetsSoftwareModule } from './assets-software/assets-software.module';
import { SoftwareVersionsModule } from './software-versions/software-versions.module';
import { ProfileGroupDetailModule } from './profile-group-detail/profile-group-detail.module';

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
		AssetSoftwareDetailsModule,
		CuiSpinnerModule,
		FormsModule,
		AssetsSoftwarePieChartModule,
		ProfileGroupsModule,
		AssetsSoftwareModule,
		SoftwareVersionsModule,
		ProfileGroupDetailModule,

	],
})
export class OptimalSoftwareVersionModule { }
