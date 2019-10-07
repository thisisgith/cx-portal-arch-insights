import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetToolbarComponent } from './asset-toolbar.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { InlineSVGModule } from 'ng-inline-svg';

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		AssetToolbarComponent,
	],
	exports: [
		AssetToolbarComponent,
	],
	imports: [
		CommonModule,
		CuiLoaderModule,
		FormsModule,
		I18nPipeModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
		ReactiveFormsModule,
		RouterModule,
	],
})
export class AssetToolbarModule { }
