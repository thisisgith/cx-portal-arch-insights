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
	CuiModalModule,
	CuiSpinnerModule,
	CuiToastModule,
} from '@cisco-ngx/cui-components';

import {
	LogService,
} from '@cisco-ngx/cui-services';
import { HeaderModule } from '@components/header/header.module';

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
	],
	providers: [
		LogService,
		{ provide: APP_BASE_HREF, useValue: '/pbc/' },
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})

export class AppModule { }
