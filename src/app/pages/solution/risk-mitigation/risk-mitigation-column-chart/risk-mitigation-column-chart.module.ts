import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskMitigationColumnChartComponent } from './risk-mitigation-column-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Column Chart Module
 */
@NgModule({
	declarations: [RiskMitigationColumnChartComponent],
	exports: [RiskMitigationColumnChartComponent],
	imports: [
		CommonModule,
		ChartModule,
	],
})
export class RiskMitigationColumnChartModule { }
