import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualFilterBarComponent } from './visual-filter-bar.component';

/**
 * Module to encapsulate VisualFilterBar component
 */
@NgModule({
	declarations: [VisualFilterBarComponent],
	exports: [VisualFilterBarComponent],
	imports: [
		CommonModule,
	],
})
export class VisualFilterBarModule { }
