import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RccAssetViolationDetailsComponent } from './rcc-asset-violation-details.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiSelectModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetDetailsModule } from '../../../../components/details/asset/asset-details.module';

/**
 * Module representing Rcc track
 */
@NgModule({
	declarations: [RccAssetViolationDetailsComponent],
	exports: [RccAssetViolationDetailsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSearchModule,
		CuiSelectModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CuiAlertModule,
		AssetDetailsModule,
	],
})
export class RccAssetViolationDetailsModule { }
