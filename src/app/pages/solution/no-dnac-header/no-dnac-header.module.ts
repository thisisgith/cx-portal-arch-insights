import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoDNACHeaderComponent } from './no-dnac-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ControlPointsModule } from '@sdp-api';
import { environment } from '@environment';
import { SharedModule } from 'src/app/shared/shared.module';

/** SDP API rootUrl */
const rootUrl = `${environment.sdpServiceOrigin}${environment.sdpServiceBasePath}`;

/**
 * Module representing the SubHeader
 */
@NgModule({
	declarations: [NoDNACHeaderComponent],
	exports: [NoDNACHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		ControlPointsModule.forRoot({ rootUrl }),
		RouterModule,
		SharedModule,
	],
})
export class NoDNACHeaderModule { }
