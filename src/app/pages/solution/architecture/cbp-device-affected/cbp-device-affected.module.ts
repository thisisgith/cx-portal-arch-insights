import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsHeaderModule, AssetDetailsModule, DetailsPanelModule } from '@components';
import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';

import {
	CuiTableModule,
	CuiPagerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Device Affected Table Component */
@NgModule({
	declarations: [CbpDeviceAffectedComponent],
	exports: [CbpDeviceAffectedComponent],
	imports: [
		AssetDetailsModule,
		AssetDetailsHeaderModule,
		CommonModule,
		DetailsPanelModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
	],
})
export class CbpDeviceAffectedModule { }
