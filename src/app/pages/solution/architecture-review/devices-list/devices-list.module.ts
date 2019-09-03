import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesListComponent } from './devices-list.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule,
	 CuiSpinnerModule, CuiDropdownModule, CuiTabsModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule, AssetDetailsModule } from '@components';
import { FormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DevicesSdaModule } from '../devices-sda/devices-sda.module';

/** Module representing the CBP Rule Violation Component */
@NgModule({
	declarations: [DevicesListComponent],
	exports: [DevicesListComponent],
	imports: [
		AssetDetailsModule,
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CuiDropdownModule,
		CuiLoaderModule,
		CuiSpinnerModule,
		I18nPipeModule,
		FormsModule,
		CuiTabsModule,
		DevicesSdaModule,
	],
})
export class DevicesListModule { }
