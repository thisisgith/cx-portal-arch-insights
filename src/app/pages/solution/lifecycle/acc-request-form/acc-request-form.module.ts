import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccRequestFormComponent } from './acc-request-form.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module representing on the ACCRequestForm of the lifecycle page
 */
@NgModule({
	declarations: [AccRequestFormComponent],
	exports: [AccRequestFormComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class AccRequestFormModule { }
