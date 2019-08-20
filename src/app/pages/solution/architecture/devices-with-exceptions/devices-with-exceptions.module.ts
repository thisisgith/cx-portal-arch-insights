import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { ArchitectureModule } from '@sdp-api';
import { environment } from '@environment';
import { DetailsPanelModule } from '@components';
import { CbpDetailsModule } from '../cbp-details/cbp-details.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetDetailsModule } from '../../../../components/details/asset/asset-details.module';
import { AssetDetailsHeaderModule } from '../../../../components/details/asset/header/header.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Devices With Exceptions Component */
@NgModule({
	declarations: [DevicesWithExceptionsComponent],
	exports : [DevicesWithExceptionsComponent],
	imports: [
		CbpDetailsModule,
		AssetDetailsModule,
		AssetDetailsHeaderModule,
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		I18nPipeModule,
		CuiSpinnerModule,
		ArchitectureModule.forRoot({ rootUrl }),
	],
})
export class DevicesWithExceptionsModule { }
