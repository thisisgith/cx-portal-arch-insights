import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureReviewComponent } from './architecture-review.component';
import { DevicesListModule } from './devices-list/devices-list.module';
import { DnacListModule } from './dnac-list/dnac-list.module';
import { ChartModule } from 'angular-highcharts';
import { CuiTabsModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { ArchitectureReviewRoutingModule } from './architecture-review-routing.module';
import { BarChartModule, PieChartModule } from '@components';
// import { Panel360Module } from '@components';

/** Module to represent the Architecture Component */
@NgModule({
	declarations: [ArchitectureReviewComponent],
	exports: [ArchitectureReviewComponent],
	imports: [
		CommonModule,
		ChartModule,
		DnacListModule,
		CuiTabsModule,
		DevicesListModule,
		CuiTabsNavModule,
		ArchitectureReviewRoutingModule,
		BarChartModule,
		CuiSpinnerModule,
		PieChartModule,
		// Panel360Module
	],
})
export class ArchitectureReviewModule { }
