import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugDetailsHeaderComponent } from './bug-details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Bug Details Header Module
 */
@NgModule({
	declarations: [BugDetailsHeaderComponent],
	exports: [BugDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class BugDetailsHeaderModule { }
