import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesComponent } from './policies.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { environment } from '@environment';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = `${environment.sdpServiceOrigin}${environment.sdpServicePaths.controlpoints}`;

/**
 * SDP Root url for the apis
 */
const sdpRootUrl = environment.sdpServiceOrigin;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		PoliciesComponent,
	],
	imports: [
		AdminWrapperModule,
		CommonModule,
		I18nPipeModule,
		CuiLoaderModule,
		ControlPointsModule.forRoot({ rootUrl }),
		UserModule.forRoot({ rootUrl: sdpRootUrl }),
	],
})
export class PoliciesModule { }
