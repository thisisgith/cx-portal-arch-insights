import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuiTabsModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

import { CbpSummaryModule } from './cbp-summary/cbp-summary.module';
import { CbpTbdModule } from './cbp-tbd/cbp-tbd.module';
import { CbpTabComponent } from './cbp-tabs/cbp-tab/cbp-tab.component';
import { CbpAweTabComponent } from './cbp-tabs/cbp-awe-tab/cbp-awe-tab.component';
import { CbpDeviceAffectedModule } from './cbp-device-affected/cbp-device-affected.module';

/** Module representing the CBP Tabs,summary ,CBP-TDB table
 * and CBP-Device-affected table for  Components
 */
@NgModule({
	declarations: [CbpTabComponent, CbpAweTabComponent],
	imports: [
		CommonModule,
		CbpSummaryModule,
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
