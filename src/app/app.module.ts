import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { HeaderModule } from '@components';
import { NoResultsModule } from './components/search/no-results/no-results.module';

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
		BrowserModule,
		ClientSSOModule,
		CommonModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiToastModule,
		FormsModule,
		HeaderModule,
		HttpClientModule,
		NoResultsModule,
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
	],
})

export class AppModule { }
