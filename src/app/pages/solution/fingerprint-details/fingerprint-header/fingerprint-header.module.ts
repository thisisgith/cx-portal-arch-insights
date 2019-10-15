import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FingerprintHeaderComponent } from './fingerprint-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CrashPreventionModule } from '@sdp-api';
import { CuiProgressbarModule } from '@cisco-ngx/cui-components';
import { environment } from '@environment';
import { TooltipModule } from '@components';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * fingerprint-header Module
 */
@NgModule({
	declarations: [FingerprintHeaderComponent],
	exports: [FingerprintHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiProgressbarModule,
		CrashPreventionModule.forRoot({ rootUrl }),
		TooltipModule,
	],
})
export class FingerprintHeaderModule { }
