import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpHeaderComponent } from './cbp-header/cbp-header.component';
import { CbpAweHeaderComponent } from './cbp-awe-header/cbp-awe-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Header Component */
@NgModule({
	declarations: [CbpHeaderComponent, CbpAweHeaderComponent],
	exports: [CbpHeaderComponent, CbpAweHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CbpDetailsHeaderModule { }
