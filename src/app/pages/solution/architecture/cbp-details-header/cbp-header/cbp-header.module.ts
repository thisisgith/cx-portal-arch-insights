import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpHeaderComponent } from './cbp-header.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Header Component */
@NgModule({
	declarations: [CbpHeaderComponent],
	exports: [ CbpHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CbpHeaderModule { }
