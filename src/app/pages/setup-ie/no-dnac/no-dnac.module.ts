import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDNACComponent, WindowService } from './no-dnac.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for showing OVA deploy steps
 */
@NgModule({
	declarations: [NoDNACComponent],
	exports: [
		NoDNACComponent,
	],
	imports: [
		CommonModule,

		I18nPipeModule,
	],
	providers: [
		WindowService,
	],
})
export class NoDNACModule { }
