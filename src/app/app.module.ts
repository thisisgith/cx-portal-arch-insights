import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

import { ClientSSOModule } from '@cisco-ngx/cui-auth';

import { environment } from '@environment';
import { APIxInterceptor } from '@interceptors';

import {
	CuiModalModule,
	CuiSpinnerModule,
	CuiToastModule,
} from '@cisco-ngx/cui-components';

import {
	LogService,
} from '@cisco-ngx/cui-services';
import { HeaderModule } from '@components';
import { NoResultsModule } from './components/search/no-results/no-results.module';
import { EntitlementModule } from '@sdp-api';
import { CaseOpenModule } from './components/case/case-open/case-open.module';
import { CloseConfirmModule } from './components/case/case-open/close-confirm/close-confirm.module';
import { CollapsibleModule } from './components/collapsible/collapsible.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

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
 * Default module for the application
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent],
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
		FormsModule,
		HeaderModule,
		HttpClientModule,
		NoResultsModule,
		CaseOpenModule,
		CloseConfirmModule,
		CollapsibleModule,
	],
	providers: [
		AppService,
		LogService,
		{
			deps: [AppService],
			multi: true,
			provide: APP_INITIALIZER,
			useFactory: loadI18n,
		},
		{ provide: APP_BASE_HREF, useValue: environment.baseHref },
		{ provide: 'ENVIRONMENT', useValue: environment },
		{ provide: HTTP_INTERCEPTORS, useClass: APIxInterceptor, multi: true },
	],
})

export class AppModule { }
