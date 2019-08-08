import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';

import {
	CuiTableModule,
	CuiPagerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CbpSummaryModule } from '../cbp-summary/cbp-summary.module';

/** Module representing the CBP Device Affected Table Component */
@NgModule({
	declarations: [CbpDeviceAffectedComponent],
	exports: [CbpDeviceAffectedComponent],
	imports: [
		CbpSummaryModule,
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
	],
})
export class CbpDeviceAffectedModule { }
