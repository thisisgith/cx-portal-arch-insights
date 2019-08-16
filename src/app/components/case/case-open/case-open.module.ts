import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule, CuiSelectModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { CaseOpenComponent } from './case-open.component';
import { CaseSubmittedModule } from './case-submitted/case-submitted.module';
import { PanelSelectModule } from './panel-select/panel-select.module';
import { CloseConfirmModule } from './close-confirm/close-confirm.module';
import { CharCountModule } from '../../char-count/char-count.module';
import { HeightTransitionModule } from '../../height-transition/height-transition.module';
import { TechFormModule } from './tech-form/tech-form.module';
import { environment } from '@environment';
import { NetworkDataGatewayModule } from '@sdp-api';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module for case open functionality
 */
@NgModule({
	declarations: [CaseOpenComponent],
	exports: [
		CaseOpenComponent,
	],
	imports: [
		CaseSubmittedModule,
		CharCountModule,
		CloseConfirmModule,
		CommonModule,
		CuiLoaderModule,
		CuiSelectModule,
		CuiSpinnerModule,
		HeightTransitionModule,
		I18nPipeModule,
		NetworkDataGatewayModule.forRoot({ rootUrl }),
		PanelSelectModule,
		ReactiveFormsModule,
		TechFormModule,
	],
})
export class CaseOpenModule { }
