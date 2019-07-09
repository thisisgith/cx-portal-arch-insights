import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Panel360HeaderComponent } from './panel360-header.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for panel 360 header component and its dependencies
 */
@NgModule({
	declarations: [Panel360HeaderComponent],
	exports: [
		Panel360HeaderComponent,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class Panel360HeaderModule { }
