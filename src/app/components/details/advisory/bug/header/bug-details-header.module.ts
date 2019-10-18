import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugDetailsHeaderComponent } from './bug-details-header.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { DateTimePipeModule, AssetsPipeModule } from '@pipes';

/**
 * Bug Details Header Module
 */
@NgModule({
	declarations: [BugDetailsHeaderComponent],
	exports: [BugDetailsHeaderComponent],
	imports: [
		AssetsPipeModule,
		CommonModule,
		DateTimePipeModule,
		FromNowPipeModule,
		I18nPipeModule,
	],
})
export class BugDetailsHeaderModule { }
