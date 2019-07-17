import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-detail.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule } from '@cisco-ngx/cui-components';

/** Module representing the Asset Software Details Component */
@NgModule({
	declarations: [
		AssetDetailsComponent,
	],
	exports: [AssetDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		CuiLoaderModule,
		CuiTabsModule,
	],
})
export class AssetDetailsModule { }
