import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule,
	 CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CbpDeviceAffectedModule } from '../cbp-device-affected/cbp-device-affected.module';

/** Module representing the CBP Rule Violation Component */
@NgModule({
	declarations: [CbpRuleViolationComponent],
	exports: [CbpRuleViolationComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CbpDeviceAffectedModule,
		CuiLoaderModule,
		CbpDeviceAffectedModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class CbpRuleViolationModule { }
