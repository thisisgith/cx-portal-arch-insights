import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsModule } from '../../../../../components/details/asset/asset-details.module';
import { AssetDetailsHeaderModule } from '../../../../../components/details/asset/header/header.module';
import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';

import {
	CuiTableModule,
	CuiPagerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsPanelModule } from '@components';

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
