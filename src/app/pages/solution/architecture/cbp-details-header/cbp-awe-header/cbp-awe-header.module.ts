import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpAweHeaderComponent } from './cbp-awe-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Header Component */
@NgModule({
	declarations: [ CbpAweHeaderComponent],
	exports: [CbpAweHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CbpAweHeaderModule { }
