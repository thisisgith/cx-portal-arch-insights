import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashRiskGridComponent } from './crash-risk-grid.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiTabsModule,
	CuiSpinnerModule,
	CuiSelectModule,
	CuiDrawersModule,
	CuiDropdownModule,
	CuiAlertModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FingerprintDetailsModule } from '../../fingerprint-details/fingerprint-details.module';
import { TooltipModule } from '@components';
/**
 * Crash Risk Grid Module
 */
@NgModule({
	declarations: [CrashRiskGridComponent],
	exports: [CrashRiskGridComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		CuiTabsModule,
		CuiSpinnerModule,
		CuiSelectModule,
		CuiDrawersModule,
		I18nPipeModule,
		FingerprintDetailsModule,
		TooltipModule,
		CuiDropdownModule,
		CuiAlertModule,
	],
})
export class CrashRiskGridModule { }
