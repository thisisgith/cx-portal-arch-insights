import { APP_INITIALIZER, Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

import { ClientSSOModule } from '@cisco-ngx/cui-auth';

import { environment } from '@environment';
import { APIxInterceptor } from '@interceptors';

import { Subject } from 'rxjs';

import {
	CuiModalModule,
	CuiSpinnerModule,
	CuiToastModule,
} from '@cisco-ngx/cui-components';

import {
	LogService,
} from '@cisco-ngx/cui-services';
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
 * MockRouter used to help show/hide the spinner
 */
class MockRouter {
	public subject = new Subject();
	public events = this.subject.asObservable();

	/**
	 * Mocking navigate from Router
	 * @param url The url to mock route to
	 */
	public navigate (url: string) {
		if (!url) {
			this.subject.next(new NavigationEnd(1, null, url));
		} else {
			this.subject.next(new NavigationStart(0, url));
		}
	}
}

/**
 * Fake Header Component
 */
@Component({
	selector: 'app-header',
	template: '<div>Fake Header</div>',
})
export class FakeHeaderComponent { }

/**
 * Default module for the application
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent, FakeHeaderComponent],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		ClientSSOModule,
		CommonModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiToastModule,
		FormsModule,
		HttpClientModule,
		NoResultsModule,
		RouterTestingModule,
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
		{
			provide: Router,
			useClass: MockRouter,
		},
	],
})
export class AppTestModule { }
