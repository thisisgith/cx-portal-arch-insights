import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsAdvisoriesComponent } from './advisories.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { DiagnosticsModule, ProductAlertsModule } from '@sdp-api';
import { CuiLoaderModule, CuiTableModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '../../panel/details-panel.module';
import { AdvisoryDetailsModule } from '../../advisory/advisory-details.module';
import { DateTimePipeModule } from '@pipes';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/** Module representing the Details Advisories Component */
@NgModule({
	declarations: [AssetDetailsAdvisoriesComponent],
	exports: [AssetDetailsAdvisoriesComponent],
	imports: [
		AdvisoryDetailsModule,
		CommonModule,
		CuiLoaderModule,
		CuiTableModule,
		DateTimePipeModule,
		DetailsPanelModule,
		DiagnosticsModule.forRoot({ rootUrl }),
		FromNowPipeModule,
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsAdvisoriesModule { }
