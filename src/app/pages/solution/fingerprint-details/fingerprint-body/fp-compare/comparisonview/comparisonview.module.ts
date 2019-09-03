import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonviewComponent } from './comparisonview.component';
import { CrashPreventionModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '@environment';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;
/**
 * comparisonview
 */
@NgModule({
	declarations: [ComparisonviewComponent],
	exports: [ComparisonviewComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiLoaderModule,
		CrashPreventionModule.forRoot({ rootUrl }),
	],
})
export class ComparisonviewModule { }
