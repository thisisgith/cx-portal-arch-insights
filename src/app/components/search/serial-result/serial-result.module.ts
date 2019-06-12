import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerialResultComponent } from './serial-result.component';

/**
 * Module representing the Serial Number Results Component
 */
@NgModule({
	declarations: [SerialResultComponent],
	exports: [SerialResultComponent],
	imports: [
		CommonModule,
	],
})
export class SerialResultModule { }
