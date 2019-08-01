import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureBarChartComponent } from './architecture-bar-chart.component';
import { ChartModule } from 'angular-highcharts';

/**
 * Module representing the Bar Chart component for the Assets page
 */
@NgModule({
	declarations: [ArchitectureBarChartComponent],
	exports: [ArchitectureBarChartComponent],
	imports: [
		ChartModule,
		CommonModule,
	],
})
export class ArchitectureBarChartModule { }
