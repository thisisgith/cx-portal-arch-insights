import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from './device-list.component';
import { FromNowPipeModule, I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * Module representing form for Policies page
 */
@NgModule({
	declarations: [DeviceListComponent],
	exports: [DeviceListComponent],
	imports: [
		CommonModule,
		FromNowPipeModule,
		I18nPipeModule,
		CuiLoaderModule,
	],
})
export class DeviceListModule { }
