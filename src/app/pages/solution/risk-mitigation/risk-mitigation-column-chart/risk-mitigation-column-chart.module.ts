import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskMitigationColumnChartComponent } from './risk-mitigation-column-chart.component';
import { ChartModule } from 'angular-highcharts';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Column Chart Module
 */
@NgModule({
	declarations: [RiskMitigationColumnChartComponent],
	exports: [RiskMitigationColumnChartComponent],
	imports: [
		CommonModule,
		ChartModule,
		I18nPipeModule,
	],
})
export class RiskMitigationColumnChartModule { }
