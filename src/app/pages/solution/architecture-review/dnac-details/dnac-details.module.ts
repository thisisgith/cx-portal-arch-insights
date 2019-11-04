import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacDetailsComponent } from './dnac-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiDrawerModule,
	CuiDrawersModule,
	CuiLoaderModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { BulletChartModule, TimeSeriesChartModule } from '@components';

/** Module representing the Devices Tabs and Details Module */
@NgModule({
	declarations: [DnacDetailsComponent],
	exports: [DnacDetailsComponent],
	imports: [
		CommonModule,
		CuiDrawerModule,
		CuiDrawersModule,
		CuiLoaderModule,
		I18nPipeModule,
		CuiSpinnerModule,
		BulletChartModule,
		TimeSeriesChartModule,
	],
})
export class DnacDetailsModule { }
