import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectComponent } from './multiselect.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for the AlertComponent
 */
@NgModule({
	declarations: [
		MultiselectComponent,
	],
	exports: [
		MultiselectComponent,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class MultiselectModule { }
