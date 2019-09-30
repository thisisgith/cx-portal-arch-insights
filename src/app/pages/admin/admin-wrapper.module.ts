import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperComponent } from './admin-wrapper.component';

import { CuiSidebarModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

/**
 * Main Settings module
 */
@NgModule({
	declarations: [
		AdminWrapperComponent,
	],
	exports: [AdminWrapperComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
		CuiSidebarModule,
		CuiSpinnerModule,
		RouterModule,
	],
})
export class AdminWrapperModule { }
