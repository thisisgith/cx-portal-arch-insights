import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNoteComponent } from './add-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { CharCountModule } from '@components';

/**
 * Add Case Notes Module
 */
@NgModule({
	declarations: [AddNoteComponent],
	exports: [AddNoteComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CharCountModule,
	],
})
export class AddNoteModule { }
