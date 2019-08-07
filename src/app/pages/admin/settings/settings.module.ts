import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { HeightTransitionModule } from '@components';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';
import { ControlPointsModule, UserModule } from '@sdp-api';

<<<<<<< HEAD
import { environment } from '@environment';
=======
import { MicroMockModule } from '@cui-x-views/mock';
>>>>>>> 92e09be7f115c3dec14207ae17f93df3a59ad0ca

import {
	CuiGaugeModule,
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

import { environment } from '@environment';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module Imports
 */
const imports = [
	AdminWrapperModule,
	CommonModule,
	ControlPointsModule.forRoot({ rootUrl }),
	CuiGaugeModule,
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
	HeightTransitionModule,
	I18nPipeModule,
	RouterModule,
	UserModule.forRoot({ rootUrl }),
];

if ((<any> environment).mock) {
	imports.push(MicroMockModule);
}

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin;

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
<<<<<<< HEAD
	imports: [
		AdminWrapperModule,
		CommonModule,
		CuiGaugeModule,
		CuiLoaderModule,
		HeightTransitionModule,
		I18nPipeModule,
		CuiSidebarModule,
		CuiSpinnerModule,
		RouterModule,
		ControlPointsModule.forRoot({ rootUrl }),
		UserModule.forRoot({ rootUrl }),
	],
=======
>>>>>>> 92e09be7f115c3dec14207ae17f93df3a59ad0ca
})
export class SettingsModule { }
