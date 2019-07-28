import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-detail.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiLoaderModule,
	CuiSpinnerModule,
	CuiTableModule,
	CuiButtonModule,
} from '@cisco-ngx/cui-components';
import { AssetTimelineChartModule } from '../asset-timeline-chart/asset-timeline-chart.module';

/** Module representing the Asset Software Details Component */
@NgModule({
	declarations: [
		AssetDetailsComponent,
	],
	exports: [AssetDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		CuiLoaderModule,
		CuiTabsModule,
		AssetTimelineChartModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiButtonModule,
	],
})
export class AssetDetailsModule { }
