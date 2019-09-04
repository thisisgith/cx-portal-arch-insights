import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackComponentModule, TooltipModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule, CuiSelectModule, CuiRatingModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { LifecycleComponent } from './lifecycle.component';
import { RacetrackModule, RacetrackContentModule } from '@sdp-api';
import { environment } from '@environment';
import { AccRequestFormModule } from './acc-request-form/acc-request-form.module';
import { CgtRequestFormModule } from './cgt-request-form/cgt-request-form.module';
import { CommunitiesModule } from './communities/communities.module';
/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

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
	declarations: [LifecycleComponent],
	imports: [
		AccRequestFormModule,
		CgtRequestFormModule,
		CommonModule,
		CuiRatingModule,
		CuiSelectModule,
		CuiSpinnerModule,
		FormsModule,
		I18nPipeModule,
		RacetrackComponentModule,
		CommunitiesModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		RouterModule.forChild(childRoutes),
		TooltipModule,
	],
	providers: [
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})
export class LifecycleModule { }
