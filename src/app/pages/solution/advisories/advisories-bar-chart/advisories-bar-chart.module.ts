import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoriesBarChartComponent } from './advisories-bar-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing a vertical bar chart
 */
@NgModule({
	declarations: [AdvisoriesBarChartComponent],
	exports: [AdvisoriesBarChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class AdvisoriesBarChartModule { }
