import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelSelectComponent } from './panel-select.component';

/**
 * Module for PanelSelectComponent export
 */
@NgModule({
	declarations: [PanelSelectComponent],
	exports: [PanelSelectComponent],
	imports: [
		CommonModule,
	],
})
export class PanelSelectModule { }
