import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityDetailsComponent } from './security-details.component';
import { ProductAlertsModule, InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { SecurityDetailsHeaderModule } from './header/security-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import {
	AdvisoriesImpactedAssetsModule,
} from './impacted-assets/advisories-impacted-assets.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing our Advisory Details Component
 */
@NgModule({
	declarations: [SecurityDetailsComponent],
	exports: [
		SecurityDetailsComponent,
		SecurityDetailsHeaderModule,
	],
	imports: [
		AdvisoriesImpactedAssetsModule,
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		SecurityDetailsHeaderModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class SecurityDetailsModule { }
