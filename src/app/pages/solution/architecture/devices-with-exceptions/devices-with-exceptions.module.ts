import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { ArchitectureModule } from '@sdp-api';
import { environment } from '@environment';


/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

@NgModule({
	declarations: [DevicesWithExceptionsComponent],
	exports : [DevicesWithExceptionsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		ArchitectureModule.forRoot({ rootUrl }),
	],
})
export class DevicesWithExceptionsModule { }
