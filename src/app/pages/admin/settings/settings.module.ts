import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { HeightTransitionModule, GaugeModule } from '@components';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTimePipeModule } from '@pipes';

import {
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
	CuiModalModule,
} from '@cisco-ngx/cui-components';

import { environment } from '@environment';

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
	GaugeModule,
	HeightTransitionModule,
	I18nPipeModule,
	FromNowPipeModule,
	RouterModule,
	FormsModule,
	ReactiveFormsModule,
	DateTimePipeModule,
	UserModule.forRoot({ rootUrl }),
	CuiModalModule,
];

/**
 * Main Settings module
 */
@NgModule({
	imports,
	declarations: [
		AppStatusColorPipe,
		ResourceGaugeColorPipe,
		SettingsComponent,
	],
})
export class SettingsModule { }
