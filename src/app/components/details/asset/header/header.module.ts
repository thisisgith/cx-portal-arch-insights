import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsHeaderComponent } from './header.component';
import { OpenCasesModule } from './open-cases/open-cases.module';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { NetworkDataGatewayModule } from '@sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Details Header Component */
@NgModule({
	declarations: [AssetDetailsHeaderComponent],
	exports: [AssetDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		OpenCasesModule,
		FromNowPipeModule,
		NetworkDataGatewayModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsHeaderModule { }
