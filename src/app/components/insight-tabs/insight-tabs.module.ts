import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightTabsComponent } from './insight-tabs.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsNavModule } from '@cisco-ngx/cui-components';

/**
 * Module to encapsulate InsightTabs component
 */
@NgModule({
	declarations: [InsightTabsComponent],
	exports: [InsightTabsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTabsNavModule,
	],
})
export class InsightTabsModule { }
