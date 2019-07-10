import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseSummaryComponent } from './case-summary.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Case Details Summary Module
 */
@NgModule({
	declarations: [CaseSummaryComponent],
	exports: [CaseSummaryComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CaseSummaryModule { }
