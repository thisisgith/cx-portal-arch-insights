import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CuiLoaderModule, CuiSelectModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { TechFormComponent } from './tech-form.component';

/**
 * TechForm Module
 */
@NgModule({
	declarations: [TechFormComponent],
	exports: [TechFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,

		CuiLoaderModule,
		CuiSelectModule,
		I18nPipeModule,
	],
})
export class TechFormModule { }
