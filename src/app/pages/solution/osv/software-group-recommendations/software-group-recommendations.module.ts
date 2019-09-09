import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	CuiTableModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { BarChartModule } from '@components';
import { SoftwareGroupRecommendationsComponent } from './software-group-recommendations.component';

/**
 * SoftwareGroup Recommendations Module
 */
@NgModule({
	declarations: [SoftwareGroupRecommendationsComponent],
	exports: [SoftwareGroupRecommendationsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiSpinnerModule,
		BarChartModule,
		CuiAlertModule,
	],
})
export class SoftwareGroupRecommendationsModule { }
