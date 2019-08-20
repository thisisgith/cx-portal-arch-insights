import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSdaTabComponent } from './devices-sda-tab.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { DevicesSdaModule } from '../../devices-sda/devices-sda.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices SDA Product Compatibility Tab */
@NgModule({
	declarations: [DevicesSdaTabComponent],
	exports: [DevicesSdaTabComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		DevicesSdaModule,
		I18nPipeModule,
	],
})
export class DevicesSdaTabModule { }
