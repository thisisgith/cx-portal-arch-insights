import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelSelectComponent } from './panel-select.component';
import { PanelSelectOptionComponent } from './panel-select-option/panel-select-option.component';

/**
 * Module for PanelSelectComponent export
 */
@NgModule({
	declarations: [
		PanelSelectComponent,
		PanelSelectOptionComponent,
	],
	exports: [
		PanelSelectComponent,
		PanelSelectOptionComponent,
	],
	imports: [
		CommonModule,
	],
})
export class PanelSelectModule { }
