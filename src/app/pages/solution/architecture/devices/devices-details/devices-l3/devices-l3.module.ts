import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesL3Component } from './devices-l3.component';

/** Module representing the Devices L3 Access Switching Component*/
@NgModule({
	declarations: [DevicesL3Component],
	exports: [DevicesL3Component],
	imports: [
		CommonModule,
	],
})
export class DevicesL3Module { }
