import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { ArchitectureModule } from '@sdp-api';
import { environment } from '@environment';
import { DetailsPanelModule } from '@components';
import { CbpDetailsModule } from '../cbp-details/cbp-details.module';
import { CbpDetailsHeaderModule } from '../cbp-details-header/cbp-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

@NgModule({
	declarations: [DevicesWithExceptionsComponent],
	exports : [DevicesWithExceptionsComponent],
	imports: [
		CbpDetailsModule,
		CbpDetailsHeaderModule,
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		I18nPipeModule,
		ArchitectureModule.forRoot({ rootUrl }),
	],
})
export class DevicesWithExceptionsModule { }
