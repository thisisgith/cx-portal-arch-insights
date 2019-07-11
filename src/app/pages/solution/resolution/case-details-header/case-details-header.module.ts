import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailsHeaderComponent } from './case-details-header.component';
import { CuiDropdownModule, CuiTableModule } from '@cisco-ngx/cui-components';
import { HttpClientModule } from '@angular/common/http';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { AddNoteModule } from '../case-details/add-note/add-note.module';
import { RelatedRmaModule } from '../case-details/related-rma/related-rma.module';

/**
 * Case Details Header Module
 */
@NgModule({
	declarations: [CaseDetailsHeaderComponent],
	exports: [CaseDetailsHeaderComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiTableModule,
		HttpClientModule,
		I18nPipeModule,
		FormsModule,
		AddNoteModule,
		FromNowPipeModule,
		RelatedRmaModule,
	],
})
export class CaseDetailsHeaderModule { }
