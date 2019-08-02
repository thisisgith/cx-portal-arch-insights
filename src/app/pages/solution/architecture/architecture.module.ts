import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureComponent } from './architecture.component';
import { CbpRuleViolationModule } from './cbp-rule-violation/cbp-rule-violation.module';
import { DevicesWithExceptionsModule } from './devices-with-exceptions/devices-with-exceptions.module';
import { ChartModule } from 'angular-highcharts';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { ArchitectureRoutingModule } from './architecture-routing.module';
import { CbpDetailsModule } from './cbp-details/cbp-details.module';
import { CbpDetailsHeaderModule } from './cbp-details-header/cbp-details-header.module';
import { BarChartModule } from '@components';
// import { Panel360Module } from '@components';

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
		ArchitectureRoutingModule,
		CbpDetailsModule,
		CbpDetailsHeaderModule,
		BarChartModule,
		// Panel360Module
	],
})
export class ArchitectureModule { }
