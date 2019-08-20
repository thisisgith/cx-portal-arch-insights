import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSdaComponent } from './devices-sda.component';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices SDA Product Compatibility Component */
@NgModule({
	declarations: [DevicesSdaComponent],
	exports: [DevicesSdaComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
	],
})
export class DevicesSdaModule { }
