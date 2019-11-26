import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailsComponent } from './case-details.component';
import {
	CuiTabsModule,
	CuiTimelineModule,
	CuiSpinnerModule,
	CuiModalModule,
} from '@cisco-ngx/cui-components';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { CaseSummaryModule } from './case-summary/case-summary.module';
import { CaseNotesModule } from './case-notes/case-notes.module';
import { CaseFilesModule } from './case-files/case-files.module';
import { CSCModule } from '@cui-x-views/csc';
import { ApixAuthInterceptor } from '@interceptors';

/**
 * Case Details Module
 */
@NgModule({
	declarations: [CaseDetailsComponent],
	exports: [CaseDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		HttpClientModule,
		CuiTimelineModule,
		I18nPipeModule,
		FormsModule,
		CaseSummaryModule,
		CaseNotesModule,
		CaseFilesModule,
		CuiSpinnerModule,
		CSCModule,
		CuiModalModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: ApixAuthInterceptor, multi: true },
	],
})
export class CaseDetailsModule { }
