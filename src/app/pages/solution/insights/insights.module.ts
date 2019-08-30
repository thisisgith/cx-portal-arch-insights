import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightsComponent } from './insights.component';
import { CuiTabsNavModule } from '@cisco-ngx/cui-components';
import { InsightsRoutingModule } from './insights-routing.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Insights track of the Solution Page
 */
@NgModule({
	declarations: [InsightsComponent],
	exports: [InsightsComponent],
	imports: [
		CommonModule,
		InsightsRoutingModule,
		CuiTabsNavModule,
		I18nPipeModule,
	],
})
export class InsightsModule { }
