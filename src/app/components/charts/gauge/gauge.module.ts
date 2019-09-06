import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugeComponent } from './gauge.component';

/**
 * Module representing the Gauge Component
 */
@NgModule({
	declarations: [GaugeComponent],
	exports: [GaugeComponent],
	imports: [
		CommonModule,
	],
})
export class GaugeModule { }
