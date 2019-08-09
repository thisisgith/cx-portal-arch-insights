import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { CbpDetailsModule } from '../cbp-details/cbp-details.module';
import { CbpDetailsHeaderModule } from '../cbp-details-header/cbp-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

@NgModule({
	declarations: [CbpRuleViolationComponent],
	exports: [CbpRuleViolationComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CbpDetailsModule,
		CbpDetailsHeaderModule,
		CuiLoaderModule,
		I18nPipeModule,
	],
})
export class CbpRuleViolationModule { }
