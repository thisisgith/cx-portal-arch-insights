import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { environment } from '@environment';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

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
		ControlPointsModule.forRoot({ rootUrl }),
		UserModule.forRoot({ rootUrl }),
		CuiLoaderModule,
		I18nPipeModule,
		RouterModule,
	],
})
export class PoliciesModule { }
