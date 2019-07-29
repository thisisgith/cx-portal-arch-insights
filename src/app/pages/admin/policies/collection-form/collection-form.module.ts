import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCollectionFormComponent } from './collection-form.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module representing edit collection form for Policies page
 */
@NgModule({
	declarations: [EditCollectionFormComponent],
	exports: [EditCollectionFormComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class EditCollectionFormModule { }
