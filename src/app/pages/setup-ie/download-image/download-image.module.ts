import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { DownloadImageComponent } from './download-image.component';
import { environment } from '../../../../environments/environment';
import { AlertModule, HeightTransitionModule } from '@components';

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
	CuiLoaderModule,
	FormsModule,
	HeightTransitionModule,
	I18nPipeModule,
	ControlPointsModule.forRoot({ rootUrl }),
];

/**
 * Module for OVA download prompt page
 */
@NgModule({
	imports,
	declarations: [DownloadImageComponent],
})
export class DownloadImageModule { }
