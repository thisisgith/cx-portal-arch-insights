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
import { CaseDetailsModule } from '../../resolution/case-details/case-details.module';
import { CaseDetailsHeaderModule } from '../../resolution/case-details-header/case-details-header.module';

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
		CaseDetailsModule,
		CaseDetailsHeaderModule,
		AssetDetailsModule,
	],
})
export class FaultDetailsModule { }
