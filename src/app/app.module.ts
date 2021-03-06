import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

import { ClientSSOModule } from '@cisco-ngx/cui-auth';

import { environment } from '@environment';

import {
	CuiModalModule,
	CuiSpinnerModule,
	CuiToastModule,
} from '@cisco-ngx/cui-components';

import {
	LogService,
} from '@cisco-ngx/cui-services';
import { HeaderModule } from './components/header/header.module';
import { NoResultsModule } from './components/search/no-results/no-results.module';
import { EntitlementModule, RacetrackModule, EntitlementWrapperModule, OrgUserModule } from '@sdp-api';
import { CaseOpenModule } from './components/case/case-open/case-open.module';
import { CloseConfirmModule } from './components/case/case-open/close-confirm/close-confirm.module';
import { ContactSupportModule } from './components/contact-support/contact-support.module';
import { CollapsibleModule } from './components/collapsible/collapsible.module';
import { FeedbackModule } from './components/feedback/feedback.module';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackFailedModule } from './components/feedback/feedback-failed/feedback-failed.module';
import {
	FeedbackSuccessModule,
} from './components/feedback/feedback-success/feedback-success.module';
import { UnauthorizedUserModule } from './components/unauthorized-user/unauthorized-user.module';
import { SmartAccountSelectionModule } from './components/smart-account-selection/smart-account-selection.module';
import { EntitlementRouteAuthService } from '@services';
import { ApixAuthInterceptor, ApixAccountInterceptor, ApixDatacenterInterceptor } from '@interceptors';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Initialization function which will load our i18n files
 * @param service The service to call
 * @returns promise representing the call
 */
export function loadI18n (service: AppService) {
	return () => new Promise(resolve => service.loadI18n()
		.subscribe(() => resolve()));
}

/**
 * Initialization function to fetch user profile/solution/technology
 * @param service The service to call
 * @returns promise which resolves after information is fetched
 */
export function loadUserInfo (service: AppService) {
	/* tslint:disable-next-line:ban */
	return () => service.initializeUser()
		.pipe(
			map(user => {
				if (user && user.info.customerId) {

					return service.initializeRacetrack(user.info.customerId);
				}

				return of({ });
			}),
		)
		.toPromise();
}

/**
 * Default module for the application
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent],
	entryComponents: [
		FeedbackComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		ClientSSOModule,
		CommonModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiToastModule,
		EntitlementModule.forRoot({ rootUrl }),
		EntitlementWrapperModule.forRoot({ rootUrl }),
		OrgUserModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		FormsModule,
		HeaderModule,
		HttpClientModule,
		NoResultsModule,
		CaseOpenModule,
		CloseConfirmModule,
		ContactSupportModule,
		CollapsibleModule,
		FeedbackModule,
		FeedbackFailedModule,
		FeedbackSuccessModule,
		UnauthorizedUserModule,
		SmartAccountSelectionModule,
	],
	providers: [
		AppService,
		EntitlementRouteAuthService,
		LogService,
		{ provide: HTTP_INTERCEPTORS, useClass: ApixAuthInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ApixAccountInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ApixDatacenterInterceptor, multi: true },
		{
			deps: [AppService],
			multi: true,
			provide: APP_INITIALIZER,
			useFactory: loadI18n,
		},
		{
			deps: [AppService],
			multi: true,
			provide: APP_INITIALIZER,
			useFactory: loadUserInfo,
		},
		{ provide: APP_BASE_HREF, useValue: environment.baseHref },
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})

export class AppModule { }
