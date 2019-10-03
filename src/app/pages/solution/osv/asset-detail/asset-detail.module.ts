import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-detail.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiSpinnerModule,
	CuiTableModule,
	CuiButtonModule,
	CuiModalModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { AssetTimelineChartModule } from '../asset-timeline-chart/asset-timeline-chart.module';
import { CancelConfirmModule } from '../cancel-confirm/cancel-confirm.module';
import { InlineSVGModule } from 'ng-inline-svg';

/** Module representing the Asset Software Details Component */
@NgModule({
	declarations: [
		AssetDetailsComponent,
	],
	exports: [AssetDetailsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTabsModule,
		CuiSpinnerModule,
		CuiTableModule,
		CuiButtonModule,
		AssetTimelineChartModule,
		CancelConfirmModule,
		CuiModalModule,
		CuiAlertModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
	],
})
export class AssetDetailsModule { }
