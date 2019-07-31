import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldNoticeDetailsComponent } from './field-notice-details.component';
import { ProductAlertsModule, InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { FieldNoticeDetailsHeaderModule } from './header/field-notice-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

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
		I18nPipeModule,
		FieldNoticeDetailsHeaderModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class FieldNoticeDetailsModule { }
