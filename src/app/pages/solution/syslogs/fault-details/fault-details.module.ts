import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaultDetailsComponent } from './fault-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiSpinnerModule,
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSelectModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { DetailsPanelModule, AssetDetailsModule } from '@components';

/**
 * This is fault details panal module
 */
@NgModule({
	declarations: [FaultDetailsComponent],
	exports: [FaultDetailsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSelectModule,
		CuiAlertModule,
		FormsModule,
		DetailsPanelModule,
		AssetDetailsModule,
	],
})
export class FaultDetailsModule { }
