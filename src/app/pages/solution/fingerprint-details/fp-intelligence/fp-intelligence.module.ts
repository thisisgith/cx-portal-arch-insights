import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpIntelligenceComponent } from './fp-intelligence.component';
import { CrashPreventionModule } from '@sdp-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarChartModule } from '@components';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * fp-intelligence Module
 */
@NgModule({
	declarations: [FpIntelligenceComponent],
	imports: [
		CommonModule,
		FormsModule,
		BarChartModule,
		ReactiveFormsModule,
		CuiLoaderModule,
		I18nPipeModule,
		CrashPreventionModule.forRoot({ rootUrl }),
	],
	exports: [FpIntelligenceComponent],
})
export class FpIntelligenceModule { }
