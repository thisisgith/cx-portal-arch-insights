import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsAdvisoriesComponent } from './advisories.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { DiagnosticsModule, ProductAlertsModule } from '@sdp-api';
import { CuiLoaderModule, CuiTableModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '../../panel/details-panel.module';
import { AdvisoryDetailsModule } from '../../advisory/advisory-details.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Details Advisories Component */
@NgModule({
	declarations: [AssetDetailsAdvisoriesComponent],
	exports: [AssetDetailsAdvisoriesComponent],
	imports: [
		AdvisoryDetailsModule,
		CommonModule,
		CuiLoaderModule,
		CuiTableModule,
		DetailsPanelModule,
		DiagnosticsModule.forRoot({ rootUrl }),
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class AssetDetailsAdvisoriesModule { }
