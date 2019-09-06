import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedRmaComponent } from './related-rma.component';
import { CuiTableModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';

/**
 * Related RMA list Module
 */
@NgModule({
	declarations: [RelatedRmaComponent],
	exports: [RelatedRmaComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		I18nPipeModule,
		FormsModule,
		FromNowPipeModule,
		CuiSpinnerModule,
	],
})
export class RelatedRmaModule { }
