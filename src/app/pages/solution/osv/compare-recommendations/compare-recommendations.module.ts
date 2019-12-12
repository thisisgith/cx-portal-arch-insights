import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	CuiTableModule,
	CuiSpinnerModule,
	CuiAlertModule,
	CuiDropdownModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { BarChartModule, TooltipModule } from '@components';
import { CompareRecommendationsComponent } from './compare-recommendations.component';

/**
 * Compare Recommendations Module
 */
@NgModule({
	declarations: [CompareRecommendationsComponent],
	exports: [CompareRecommendationsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiSpinnerModule,
		BarChartModule,
		CuiAlertModule,
		CuiDropdownModule,
		TooltipModule,
	],
})
export class CompareRecommendationsModule { }
