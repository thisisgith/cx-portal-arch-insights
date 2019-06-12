import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsHeaderComponent } from './details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Details Header Component */
@NgModule({
	declarations: [DetailsHeaderComponent],
	exports: [DetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class DetailsHeaderModule { }
