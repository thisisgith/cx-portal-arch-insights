import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPanelHeaderComponent } from './header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for panel 360 header component and its dependencies
 */
@NgModule({
	declarations: [DetailsPanelHeaderComponent],
	exports: [DetailsPanelHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class DetailsPanelHeaderModule { }
