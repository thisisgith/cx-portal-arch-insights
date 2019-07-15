import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetSoftwareDetailsComponent } from './details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiLoaderModule } from '@cisco-ngx/cui-components';

/** Module representing the Asset Software Details Component */
@NgModule({
	declarations: [
		AssetSoftwareDetailsComponent,
	],
	exports: [AssetSoftwareDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		CuiLoaderModule,
		CuiTabsModule,
	],
})
export class AssetSoftwareDetailsModule { }
