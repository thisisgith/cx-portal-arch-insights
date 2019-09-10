import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FingerprintBodyComponent } from './fingerprint-body.component';
import { FpCompareModule } from './fp-compare/fp-compare.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule, CuiAlertModule } from '@cisco-ngx/cui-components';
import { FpCompareComponent } from './fp-compare/fp-compare.component';
import { FpIntelligenceModule } from '../fp-intelligence/fp-intelligence.module';
import { FpSimilarAssetsModule } from '../fp-similarassets/fp-similarassets.module';
import { MlVisualizationModule } from '../ml-visualization/ml-visualization.module';

/**
 * fingerprint-body Module
 */
@NgModule({
	declarations: [FingerprintBodyComponent],
	exports: [FingerprintBodyComponent],
	imports: [
		CommonModule,
		FpCompareModule,
		I18nPipeModule,
		CuiTabsModule,
		FpIntelligenceModule,
		FpSimilarAssetsModule,
		CuiAlertModule,
		MlVisualizationModule,
	],
	entryComponents: [
		FpCompareComponent,
	],
})
export class FingerprintBodyModule { }
