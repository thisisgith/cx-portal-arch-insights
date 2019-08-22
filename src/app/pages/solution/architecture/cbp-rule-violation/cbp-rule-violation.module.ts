import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule,
	 CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { CbpDetailsModule } from '../cbp-details/cbp-details.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Rule Violation Component */
@NgModule({
	declarations: [CbpRuleViolationComponent],
	exports: [CbpRuleViolationComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CbpDetailsModule,
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
	],
})
export class CbpRuleViolationModule { }
