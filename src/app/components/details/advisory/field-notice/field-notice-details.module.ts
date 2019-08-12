import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeDetailsComponent } from './field-notice-details.component';
import { ProductAlertsModule, InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { FieldNoticeDetailsHeaderModule } from './header/field-notice-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import {
	FieldNoticeImpactedAssetsModule,
} from './impacted-assets/field-notice-impacted-assets.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing our Field Notice Details Component
 */
@NgModule({
	declarations: [FieldNoticeDetailsComponent],
	exports: [
		FieldNoticeDetailsComponent,
		FieldNoticeDetailsHeaderModule,
	],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		FieldNoticeDetailsHeaderModule,
		FieldNoticeImpactedAssetsModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class FieldNoticeDetailsModule { }
