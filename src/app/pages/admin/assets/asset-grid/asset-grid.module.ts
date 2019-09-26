import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetGridComponent } from './asset-grid.component';
import { FromNowPipeModule, I18nPipeModule, TruncatePipeModule } from '@cisco-ngx/cui-pipes';
import { CuiDropdownModule, CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * SDP Root url for the apis
 */
// const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		AssetGridComponent,
	],
	exports: [
		AssetGridComponent,
	],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiLoaderModule,
		FromNowPipeModule,
		I18nPipeModule,
		RouterModule,
		TruncatePipeModule,
	],
})
export class AssetGridModule { }
