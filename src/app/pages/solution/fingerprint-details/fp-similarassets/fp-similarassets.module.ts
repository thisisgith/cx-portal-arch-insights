import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpSimilarAssetsComponent } from './fp-similarassets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiTableModule, CuiPagerModule,
	CuiLoaderModule, CuiProgressbarModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { CrashPreventionModule } from '@sdp-api';
import { ComparisonviewModule } from '../fingerprint-body/fp-compare/comparisonview/comparisonview.module';
import { TooltipModule } from '@components';
import { RiskScoreComponent } from './risk-score/risk-score.component';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

	/**
	 * FpSimilarAssetsComponent
	 */
@NgModule({
	declarations: [FpSimilarAssetsComponent, RiskScoreComponent],
	entryComponents: [RiskScoreComponent],
	exports: [FpSimilarAssetsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ComparisonviewModule,
		CuiTableModule,
		CuiPagerModule,
		CuiLoaderModule,
		CuiProgressbarModule,
		I18nPipeModule,
		CrashPreventionModule.forRoot({ rootUrl }),
		TooltipModule,
	],
})
export class FpSimilarAssetsModule { }
