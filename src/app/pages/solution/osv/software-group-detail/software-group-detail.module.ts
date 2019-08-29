import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiButtonModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetDetailsModule } from '../asset-detail/asset-detail.module';
import { BarChartModule } from '@components';

/**
 * SoftwareGroupDetail Module
 */
@NgModule({
	declarations: [SoftwareGroupDetailComponent],
	exports: [SoftwareGroupDetailComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSpinnerModule,
		AssetDetailsModule,
		CuiButtonModule,
		BarChartModule,
	],
})
export class SoftwareGroupDetailModule { }
