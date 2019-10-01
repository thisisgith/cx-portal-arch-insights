import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiButtonModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetDetailsModule } from '../asset-detail/asset-detail.module';
import { BarChartModule, DetailsPanelModule } from '@components';
import { CancelConfirmModule } from '../cancel-confirm/cancel-confirm.module';
import {
	SoftwareGroupRecommendationsModule,
} from '../software-group-recommendations/software-group-recommendations.module';
import {
	CompareRecommendationsModule,
} from '../compare-recommendations/compare-recommendations.module';
import { BugsDetailsModule } from '../bugs-details/bugs-details.module';

/**
 * SoftwareGroupDetail Module
 */
@NgModule({
	declarations: [SoftwareGroupDetailComponent],
	exports: [SoftwareGroupDetailComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSpinnerModule,
		AssetDetailsModule,
		CuiButtonModule,
		BarChartModule,
		CancelConfirmModule,
		CuiAlertModule,
		DetailsPanelModule,
		SoftwareGroupRecommendationsModule,
		CompareRecommendationsModule,
		BugsDetailsModule,
	],
})
export class SoftwareGroupDetailModule { }
