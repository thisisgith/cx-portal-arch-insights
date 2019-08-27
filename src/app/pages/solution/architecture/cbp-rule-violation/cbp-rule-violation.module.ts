import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule,
	 CuiSpinnerModule, CuiDropdownModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { FormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CbpDeviceAffectedModule } from '../cbp-details/cbp-device-affected/cbp-device-affected.module';

/** Module representing the CBP Rule Violation Component */
@NgModule({
	declarations: [CbpRuleViolationComponent],
	exports: [CbpRuleViolationComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CuiDropdownModule,
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
		CbpDeviceAffectedModule,
		FormsModule,
	],
})
export class CbpRuleViolationModule { }
