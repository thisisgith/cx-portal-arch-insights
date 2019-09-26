import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseNotesComponent } from './case-notes.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';

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
	],
})
export class CaseNotesModule { }
