import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiGaugeComponent } from './multi-gauge.component';

/**
 * Module representing the Gauge Component
 */
@NgModule({
	declarations: [MultiGaugeComponent],
	exports: [MultiGaugeComponent],
	imports: [
		CommonModule,
	],
})
export class MultiGaugeModule { }
