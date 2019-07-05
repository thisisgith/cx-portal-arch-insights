import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailsComponent } from './case-details.component';
import {
	CuiTabsModule,
	CuiDropdownModule,
	CuiTimelineModule,
	CuiTableModule,
} from '@cisco-ngx/cui-components';
import { HttpClientModule } from '@angular/common/http';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { CaseSummaryModule } from './case-summary/case-summary.module';

/**
 * Case Details Module
 */
@NgModule({
	declarations: [CaseDetailsComponent],
	exports: [CaseDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		CuiDropdownModule,
		CuiTimelineModule,
		CuiTableModule,
		HttpClientModule,
		I18nPipeModule,
		FormsModule,
		CaseSummaryModule,
	],
})
export class CaseDetailsModule { }
