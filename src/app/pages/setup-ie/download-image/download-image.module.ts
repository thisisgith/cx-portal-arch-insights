import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { DownloadImageComponent } from './download-image.component';
import { environment } from '../../../../environments/environment';
import { MicroMockModule } from '@cui-x-views/mock';
import { AlertModule, HeightTransitionModule } from '@components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

import { ControlPointsModule } from '@sdp-api';

/**
 * SDP Root url for the apis
 */
const sdpRootUrl = environment.sdpServiceOrigin;

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
	ControlPointsModule.forRoot({ rootUrl: sdpRootUrl }),
];

if ((<any> environment).mock) {
	imports.unshift(MicroMockModule);
}

/**
 * Module for OVA download prompt page
 */
@NgModule({
	imports,
	declarations: [DownloadImageComponent],
})
export class DownloadImageModule { }
