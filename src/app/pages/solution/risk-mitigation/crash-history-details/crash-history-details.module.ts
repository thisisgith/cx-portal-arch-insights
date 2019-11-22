import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashHistoryDetailsComponent } from './crash-history-details.component';
import { CuiTableModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsPanelModule, AssetDetailsModule } from '@components';

/**
 * Shows setails about a crashed system
 */
@NgModule({
	declarations: [CrashHistoryDetailsComponent],
	exports: [CrashHistoryDetailsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiLoaderModule,
		I18nPipeModule,
		DetailsPanelModule,
		AssetDetailsModule,
	],
})
export class CrashHistoryDetailsModule { }
