import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { DownloadImageComponent } from './download-image.component';
import { environment } from '../../../../environments/environment';
import { AlertModule, HeightTransitionModule } from '@components';
import { EULAFormModule } from './eula-form/eula-form.module';
import { K9FormModule } from './k9-form/k9-form.module';
import { K9DeclineModule } from './k9-decline/k9-decline.module';
import { ConnectModule } from './connect-form/connect.module';
import { InstallProgressModule } from '../install-progress/install-progress.module';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

import { ControlPointsModule } from '@sdp-api';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * DownloadImageModule imports
 */
const imports = [
	AlertModule,
	CommonModule,
	ConnectModule,
	ControlPointsModule.forRoot({ rootUrl }),
	CuiLoaderModule,
	EULAFormModule,
	FormsModule,
	HeightTransitionModule,
	I18nPipeModule,
	InstallProgressModule,
	K9DeclineModule,
	K9FormModule,
	ReactiveFormsModule,
	RouterModule,
];

/**
 * Module for OVA download prompt page
 */
@NgModule({
	imports,
	declarations: [DownloadImageComponent],
})
export class DownloadImageModule { }
