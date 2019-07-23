import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbpSummaryComponent } from './cbp-summary.component';

import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Summary Component */
@NgModule({
	declarations: [CbpSummaryComponent],
	exports: [CbpSummaryComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
	],
})
export class CbpSummaryModule { }
