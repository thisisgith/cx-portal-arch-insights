import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesComponent } from './policies.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { environment } from '@environment';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin;

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
		RouterTestingModule,
		ControlPointsModule.forRoot({ rootUrl }),
		UserModule.forRoot({ rootUrl }),
	],
})
export class PoliciesModule { }
