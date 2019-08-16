import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacListComponent } from './dnac-list.component';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { ArchitectureModule } from '@sdp-api';
import { environment } from '@environment';
import { DetailsPanelModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DevicesDetailsModule } from '../devices/devices-details/devices-details.module';
import { DevicesDetailsHeaderModule } from
'../devices/devices-details-header/devices-details-header.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Devices With Exceptions Component */
@NgModule({
	declarations: [DnacListComponent],
	exports : [DnacListComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		I18nPipeModule,
		DevicesDetailsModule,
		DevicesDetailsHeaderModule,
		ArchitectureModule.forRoot({ rootUrl }),
	],
})
export class DnacListModule { }
