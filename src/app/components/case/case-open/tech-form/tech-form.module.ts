import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CuiLoaderModule, CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { TechFormComponent } from './tech-form.component';
import { PanelSelectModule } from '../panel-select/panel-select.module';
import { HeightTransitionModule } from '../../../height-transition/height-transition.module';

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
		CuiSpinnerModule,
		I18nPipeModule,

		PanelSelectModule,
		HeightTransitionModule,
	],
})
export class TechFormModule { }
