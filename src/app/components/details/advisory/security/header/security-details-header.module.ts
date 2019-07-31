import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityDetailsHeaderComponent } from './security-details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Security Details Header Module
 */
@NgModule({
	declarations: [SecurityDetailsHeaderComponent],
	exports: [SecurityDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class SecurityDetailsHeaderModule { }
