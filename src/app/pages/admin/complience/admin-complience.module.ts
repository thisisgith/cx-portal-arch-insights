import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminComplienceComponent } from './admin-complience.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';

import {
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
	CuiModalModule,
	CuiAlertModule,

} from '@cisco-ngx/cui-components';

import { environment } from '@environment';
import { AssetTaggingModule, TooltipModule } from '@components';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module Imports
 */
const imports = [
	AdminWrapperModule,
	CommonModule,
	ControlPointsModule.forRoot({ rootUrl }),
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
	I18nPipeModule,
	FromNowPipeModule,
	RouterModule,
	AssetTaggingModule,
	CuiModalModule,
	CuiAlertModule,
	TooltipModule,
	UserModule.forRoot({ rootUrl }),
];

/**
 * Main Settings module
 */
@NgModule({
	imports,
	declarations: [
		AdminComplienceComponent,
	],
})
export class AdminComplienceModule { }
