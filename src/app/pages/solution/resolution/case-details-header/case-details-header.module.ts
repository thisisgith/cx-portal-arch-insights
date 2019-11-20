import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailsHeaderComponent } from './case-details-header.component';
import { CuiDropdownModule, CuiSpinnerModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { AddNoteModule } from '../case-details/add-note/add-note.module';
import { RelatedRmaModule } from '../case-details/related-rma/related-rma.module';
import { CSCModule } from '@cui-x-views/csc';
import { DateTimePipeModule } from '@pipes';
import { APIxInterceptor } from '@interceptors';

/**
 * Case Details Header Module
 */
@NgModule({
	declarations: [CaseDetailsHeaderComponent],
	exports: [CaseDetailsHeaderComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		HttpClientModule,
		I18nPipeModule,
		FormsModule,
		AddNoteModule,
		RelatedRmaModule,
		CuiSpinnerModule,
		CSCModule,
		CuiModalModule,
		FromNowPipeModule,
		DateTimePipeModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: APIxInterceptor, multi: true },
	],
})
export class CaseDetailsHeaderModule { }
