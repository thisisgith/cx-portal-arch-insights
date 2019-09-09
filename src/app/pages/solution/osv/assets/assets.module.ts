import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import {
	CuiTableModule,
	CuiDropdownModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * AssetModule
 */
@NgModule({
	declarations: [AssetsComponent],
	exports: [AssetsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiDropdownModule,
		I18nPipeModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiAlertModule,
	],
})
export class AssetsModule { }
