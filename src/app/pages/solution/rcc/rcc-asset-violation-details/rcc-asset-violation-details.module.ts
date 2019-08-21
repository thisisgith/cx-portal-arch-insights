import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RccAssetViolationDetailsComponent } from './rcc-asset-violation-details.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiSelectModule,
} from '@cisco-ngx/cui-components';
import { HttpClientModule } from '@angular/common/http';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

@NgModule({
	declarations: [RccAssetViolationDetailsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSearchModule,
		CuiSelectModule,
		I18nPipeModule,
		HttpClientModule,
	],
	exports: [RccAssetViolationDetailsComponent]
})
export class RccAssetViolationDetailsModule { }
