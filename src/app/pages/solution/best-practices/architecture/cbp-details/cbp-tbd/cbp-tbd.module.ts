import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbpTbdComponent } from './cbp-tbd.component';

import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';

/**
 * CBP TBD Table Module
 */
@NgModule({
	declarations: [CbpTbdComponent],
	exports: [CbpTbdComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
	],
})
export class CbpTbdModule { }
