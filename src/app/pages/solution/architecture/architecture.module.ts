import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureComponent } from './architecture.component';
import { CbpRuleViolationModule } from './cbp-rule-violation/cbp-rule-violation.module';
import {
	DevicesWithExceptionsModule } from './devices-with-exceptions/devices-with-exceptions.module';
import { ChartModule } from 'angular-highcharts';
import { CuiTabsModule, CuiSpinnerModule , CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { CbpDetailsModule } from './cbp-details/cbp-details.module';
import { BarChartModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module to represent the Architecture Component */
@NgModule({
	declarations: [ArchitectureComponent],
	exports: [ArchitectureComponent],
	imports: [
		CommonModule,
		ChartModule,
		CbpRuleViolationModule,
		CuiTabsModule,
		DevicesWithExceptionsModule,
		CuiTabsNavModule,
		CbpDetailsModule,
		BarChartModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class ArchitectureModule { }
