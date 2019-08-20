import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSrTabComponent } from './devices-sr-tab.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { DevicesSrModule } from '../../devices-sr/devices-sr.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices Switch Redandancy Tab */
@NgModule({
	declarations: [DevicesSrTabComponent],
	exports: [DevicesSrTabComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		DevicesSrModule,
		I18nPipeModule,
	],
})
export class DevicesSrTabModule { }
