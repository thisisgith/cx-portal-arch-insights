import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackComponentModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule, CuiSelectModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { LifecycleComponent } from './lifecycle.component';
import { RacetrackModule, RacetrackContentModule, SdpApiModule } from '@cui-x/sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpOrigin;

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
		CommonModule,
		CuiSpinnerModule,
		CuiSelectModule,
		FormsModule,
		I18nPipeModule,
		RacetrackComponentModule,
		RacetrackContentModule.forRoot({ rootUrl }),
		RacetrackModule.forRoot({ rootUrl }),
		RouterModule.forChild(childRoutes),
		SdpApiModule,
	],
	providers: [
		{ provide: 'ENVIRONMENT', useValue: environment },
	],
})
export class LifecycleModule { }
