import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbpTbdComponent } from './cbp-tbd.component';

import {
	CuiTableModule,
	CuiPagerModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * CBP TBD Table Module
 */
@NgModule({
	declarations: [CbpTbdComponent],
	exports: [CbpTbdComponent],
	imports: [
		CommonModule,
		CuiPagerModule,
		CuiTableModule,
		I18nPipeModule,
	],
})
export class CbpTbdModule { }
