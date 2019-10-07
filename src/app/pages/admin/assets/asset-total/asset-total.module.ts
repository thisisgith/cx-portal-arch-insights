import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetTotalComponent } from './asset-total.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		AssetTotalComponent,
	],
	exports: [
		AssetTotalComponent,
	],
	imports: [
		CommonModule,
		CuiLoaderModule,
		I18nPipeModule,
		RouterModule,
	],
})
export class AssetTotalModule { }
