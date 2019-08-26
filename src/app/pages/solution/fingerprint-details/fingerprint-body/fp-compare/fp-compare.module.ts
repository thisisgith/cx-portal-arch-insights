import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpCompareComponent } from './fp-compare.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSelectModule, CuiButtonModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { CrashPreventionModule } from '@sdp-api';
import { ComparisonviewModule } from './comparisonview/comparisonview.module';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * fp-compare module
 */
@NgModule({
	declarations: [FpCompareComponent],
	exports: [FpCompareComponent],
	imports: [
		CommonModule,
		ComparisonviewModule,
		I18nPipeModule,
		CuiSelectModule,
		CuiButtonModule,
		FormsModule,
		CrashPreventionModule.forRoot({ rootUrl }),
	],
})
export class FpCompareModule { }
