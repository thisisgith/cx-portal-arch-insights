import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetMapComponent } from './asset-map.component';
import { environment } from '@environment';

/**
 * Asset Map Module
 */
@NgModule({
	declarations: [AssetMapComponent],
	exports: [AssetMapComponent],
	imports: [
		CommonModule,
		CuiLoaderModule,
		I18nPipeModule,
		NgxMapboxGLModule.withConfig({
			accessToken: environment.mapboxToken,
		}),
	],
})
export class AssetMapModule { }
