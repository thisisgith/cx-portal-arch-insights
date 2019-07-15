import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { HeightTransitionModule } from '@components';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

import { environment } from '@environment';

import {
	CuiGaugeModule,
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = `${environment.sdpServiceOrigin}${environment.sdpServicePaths.controlpoints}`;

/**
 * SDP Root url for the apis
 */
const sdpRootUrl = environment.sdpServiceOrigin;

/**
 * Main Settings module
 */
@NgModule({
	declarations: [
		AppStatusColorPipe,
		ResourceGaugeColorPipe,
		SettingsComponent,
	],
	imports: [
		AdminWrapperModule,
		CommonModule,
		CuiGaugeModule,
		CuiLoaderModule,
		HeightTransitionModule,
		I18nPipeModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		ControlPointsModule.forRoot({ rootUrl }),
		UserModule.forRoot({ rootUrl: sdpRootUrl }),
	],
})
export class SettingsModule { }
