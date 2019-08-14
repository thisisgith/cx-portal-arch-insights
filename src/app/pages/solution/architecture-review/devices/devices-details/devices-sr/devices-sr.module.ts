import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSrComponent } from './devices-sr.component';

/** Module representing the Devices Switch Redandancy Component */
@NgModule({
	declarations: [DevicesSrComponent],
	exports: [DevicesSrComponent],
	imports: [
		CommonModule,
	],
})
export class DevicesSrModule { }
