import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureComponent } from './architecture.component';
import { CbpRuleViolationModule } from './cbp-rule-violation/cbp-rule-violation.module';
import {
	DevicesWithExceptionsModule } from './devices-with-exceptions/devices-with-exceptions.module';
import { ChartModule } from 'angular-highcharts';
import { CuiTabsModule, CuiSpinnerModule , CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { CbpDetailsModule } from './cbp-details/cbp-details.module';
import { BarChartModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { ArchitectureModules } from '@sdp-api';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Child routes for OptimalSoftwareModule for lazy loading
 */
const childRoutes: Routes = [
	{
		component: ArchitectureComponent,
		path: '',
	},
];

/** Module to represent the Architecture Component */
@NgModule({
	declarations: [ArchitectureComponent],
	exports: [ArchitectureComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		ChartModule,
		CbpRuleViolationModule,
		CuiTabsModule,
		DevicesWithExceptionsModule,
		CuiTabsNavModule,
		CbpDetailsModule,
		BarChartModule,
		ArchitectureModules.forRoot({ rootUrl }),
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class ArchitectureModule { }
