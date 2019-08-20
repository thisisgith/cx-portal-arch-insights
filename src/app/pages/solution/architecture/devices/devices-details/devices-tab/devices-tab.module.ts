import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesTabComponent } from './devices-tab.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DevicesL3Module } from '../devices-l3/devices-l3.module';
import { DevicesSdaModule } from '../devices-sda/devices-sda.module';
import { DevicesSimtuModule } from '../devices-simtu/devices-simtu.module';
import { DevicesSrModule } from '../devices-sr/devices-sr.module';

@NgModule({
	declarations: [DevicesTabComponent],
	exports: [DevicesTabComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		DevicesL3Module,
		DevicesSdaModule,
		DevicesSimtuModule,
		DevicesSrModule,
		I18nPipeModule,
	],
})
export class DevicesTabModule { }
