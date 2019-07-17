import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsSoftwareComponent } from './assets-software.component';
import { CuiTableModule, CuiDropdownModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * AssetModule
 */
@NgModule({
	declarations: [AssetsSoftwareComponent],
	exports: [AssetsSoftwareComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiDropdownModule,
		I18nPipeModule,
	],
})
export class AssetsSoftwareModule { }
