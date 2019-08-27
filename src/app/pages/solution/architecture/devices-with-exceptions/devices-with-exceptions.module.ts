import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule,
	CuiDropdownModule } from '@cisco-ngx/cui-components';
import { ArchitectureModules } from '@sdp-api';
import { environment } from '@environment';
import { AssetDetailsModule, DetailsPanelModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { CbpTbdModule } from '../cbp-tbd/cbp-tbd.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Devices With Exceptions Component */
@NgModule({
	declarations: [DevicesWithExceptionsComponent],
	exports : [DevicesWithExceptionsComponent],
	imports: [
		CbpTbdModule,
		CommonModule,
		CuiDropdownModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		I18nPipeModule,
		CuiSpinnerModule,
		AssetDetailsModule,
		FormsModule,
		ArchitectureModules.forRoot({ rootUrl }),
	],
})
export class DevicesWithExceptionsModule { }
