import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTaggingComponent } from './asset-tagging.component';
import { AdminWrapperModule } from '../../pages/admin/admin-wrapper.module';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiLoaderModule, CuiSearchModule } from '@cisco-ngx/cui-components';
import { TagListModule } from './tag-list/tag-list.module';
import {  AssetTaggingModules } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing for Asset Tagging page
 */
@NgModule({
	declarations: [
		AssetTaggingComponent,
	],
	exports: [AssetTaggingComponent],
	imports: [
		AdminWrapperModule,
		CommonModule,
		FormsModule,
		I18nPipeModule,
		FromNowPipeModule,
		ReactiveFormsModule,
		CuiLoaderModule,
		CuiSearchModule,
		TagListModule,
		AssetTaggingModules.forRoot({ rootUrl }),
	],
})
export class AssetTaggingModule { }
