import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackComponentModule, TooltipModule, MultiselectModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule, CuiSelectModule, CuiRatingModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { LifecycleComponent } from './lifecycle.component';
import { RacetrackModule, RacetrackContentModule, PartnerModule } from '@sdp-api';
import { environment } from '@environment';
import { AccRequestFormModule } from './acc-request-form/acc-request-form.module';
import { CgtRequestFormModule } from './cgt-request-form/cgt-request-form.module';
import { CommunitiesModule } from './communities/communities.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { ImageDefaultDirective } from '@directives/image-default.directive';
import { SessionFeedbackComponent } from './feedback/session-feedback.component';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
/**
 * The SDP Partner API does not include '/api'
 */
const rootUrlForPartner = environment.sdpServiceOrigin;

/**
 * Child routes for Lifecycle Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: LifecycleComponent,
		path: '',
	},
];

/**
 * Module representing the Lifecycle Component of the Solution Page
 */
@NgModule({
	declarations: [LifecycleComponent, ImageDefaultDirective, SessionFeedbackComponent],
	imports: [
		AccRequestFormModule,
		CgtRequestFormModule,
		CommonModule,
		CuiRatingModule,
		CuiSelectModule,
		CuiSpinnerModule,
		FormsModule,
		I18nPipeModule,
		MultiselectModule,
		RacetrackComponentModule,
		CommunitiesModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		PartnerModule.forRoot({ rootUrl: rootUrlForPartner }),
		RouterModule.forChild(childRoutes),
		TooltipModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
		MultiselectModule,
	],
	providers: [
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})
export class LifecycleModule { }
