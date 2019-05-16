import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RacetrackCarModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';
import { LifecycleComponent } from './lifecycle.component';
import { RacetrackModule, RacetrackContentModule } from '@cui-x/sdp-api';
import { environment } from '@environment';

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
		I18nPipeModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
		CuiSpinnerModule,
		FormsModule,
		RacetrackCarModule,
		RacetrackModule.forRoot({ rootUrl: environment.services.sdp.origin }),
		RacetrackContentModule.forRoot({ rootUrl: environment.services.sdp.origin }),
	],
})
export class LifecycleModule { }
