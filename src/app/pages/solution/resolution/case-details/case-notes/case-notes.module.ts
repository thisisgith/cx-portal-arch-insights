import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseNotesComponent } from './case-notes.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { DateTimePipeModule } from '@pipes';

/**
 * Case Notes Module
 */
@NgModule({
	declarations: [CaseNotesComponent],
	exports: [CaseNotesComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		FromNowPipeModule,
		DateTimePipeModule,
	],
})
export class CaseNotesModule { }
