import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsAdvisoriesComponent } from './details-advisories.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { ProductAlertsModule } from '@sdp-api';
import { CuiLoaderModule, CuiTableModule } from '@cisco-ngx/cui-components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/** Module representing the Details Advisories Component */
@NgModule({
	declarations: [DetailsAdvisoriesComponent],
	exports: [DetailsAdvisoriesComponent],
	imports: [
		CommonModule,
		CuiLoaderModule,
		CuiTableModule,
		I18nPipeModule,
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class DetailsAdvisoriesModule { }
