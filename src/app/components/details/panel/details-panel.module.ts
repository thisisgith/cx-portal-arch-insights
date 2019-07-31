import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPanelComponent } from './details-panel.component';
import { DetailsPanelHeaderModule } from './header/header.module';
import { DetailsPanelTitleDirective } from './directives/directives';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for the 360 detail panel component and its dependencies
 */
@NgModule({
	declarations: [
		DetailsPanelComponent,
		DetailsPanelTitleDirective,
	],
	exports: [
		DetailsPanelComponent,
		DetailsPanelHeaderModule,
		DetailsPanelTitleDirective,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class DetailsPanelModule { }
