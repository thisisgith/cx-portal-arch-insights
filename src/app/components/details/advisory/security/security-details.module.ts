import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityDetailsComponent } from './security-details.component';
import { ProductAlertsModule, InventoryModule } from '@sdp-api';
import { environment } from '@environment';
import { SecurityDetailsHeaderModule } from './header/security-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

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
		CommonModule,
		I18nPipeModule,
		SecurityDetailsHeaderModule,
		InventoryModule.forRoot({ rootUrl }),
		ProductAlertsModule.forRoot({ rootUrl }),
	],
})
export class SecurityDetailsModule { }
