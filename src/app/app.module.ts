import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClientSSOModule } from '@cisco-ngx/cui-auth';

import { environment } from '../environments/environment';

import {
	CuiFooterModule,
	CuiHeaderModule,
	CuiModalModule,
	CuiSpinnerModule,
	CuiToastModule,
	CuiModalService,
} from '@cisco-ngx/cui-components';

import {
	I18nPipeModule,
} from '@cisco-ngx/cui-pipes';

import {
	LogService,
} from '@cisco-ngx/cui-services';

/**
 * Default module for the application
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		CommonModule,
		ClientSSOModule,
		CuiFooterModule,
		CuiHeaderModule,
		CuiModalModule,
		CuiSpinnerModule,
		CuiToastModule,
		FormsModule,
		HttpClientModule,
		I18nPipeModule,
	],
	providers: [
		CuiModalService,
		LogService,
		{ provide: APP_BASE_HREF, useValue: '/pbc/' },
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})

export class AppModule { }
