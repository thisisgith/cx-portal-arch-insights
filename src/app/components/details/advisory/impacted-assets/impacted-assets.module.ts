import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisoryImpactedAssetsComponent } from './impacted-assets.component';
import { InventoryModule, DiagnosticsModule } from '@sdp-api';
import { environment } from '@environment';
import { I18nPipeModule, TruncatePipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTableModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { RouterModule } from '@angular/router';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing our Advisory Details Component
 */
@NgModule({
	declarations: [AdvisoryImpactedAssetsComponent],
	exports: [
		AdvisoryImpactedAssetsComponent,
	],
	imports: [
		CommonModule,
		CuiSpinnerModule,
		CuiTableModule,
		InventoryModule.forRoot({ rootUrl }),
		DiagnosticsModule.forRoot({ rootUrl }),
		I18nPipeModule,
		RouterModule,
		TruncatePipeModule,
	],
})
export class AdvisoryImpactedAssetsModule { }
