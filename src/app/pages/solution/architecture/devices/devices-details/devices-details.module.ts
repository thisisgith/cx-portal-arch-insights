import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesL3Module } from './devices-l3/devices-l3.module';
import { DevicesSdaModule } from './devices-sda/devices-sda.module';
import { DevicesSimtuModule } from './devices-simtu/devices-simtu.module';
import { DevicesSrModule } from './devices-sr/devices-sr.module';
import { DevicesTabModule } from './devices-tab/devices-tab.module';

/** Module representing the Devices Tabs and Details Module */
@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		DevicesL3Module,
		DevicesSdaModule,
		DevicesSimtuModule,
		DevicesSrModule,
	],
	exports: [
		DevicesTabModule,
	]
})
export class DevicesDetailsModule { }
