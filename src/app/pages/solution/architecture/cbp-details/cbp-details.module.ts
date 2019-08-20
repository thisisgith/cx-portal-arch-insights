import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuiTabsModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CbpTbdModule } from './cbp-tbd/cbp-tbd.module';
import { CbpDeviceAffectedModule } from './cbp-device-affected/cbp-device-affected.module';

/** Module representing the CBP Tabs,summary ,CBP-TDB table
 * and CBP-Device-affected table for  Components
 */
@NgModule({
	imports: [
		CommonModule,		
		CbpDeviceAffectedModule,
		CbpTbdModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
	],
	exports: [
		CbpDeviceAffectedModule,
		CbpTbdModule,
	],
})
export class CbpDetailsModule { }
