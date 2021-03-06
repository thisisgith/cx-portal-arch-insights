import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
	I18nPipeModule,
} from '@cisco-ngx/cui-pipes';
import {
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';
import { RMASearchComponent } from './rma-search.component';
import { GeneralSearchModule } from '../general-search/general-search.module';
import { CourierLinkPipe } from './pipes/courier-link.pipe';

/**
 * Module for the "general search results" area of the search modal
 */
@NgModule({
	declarations: [RMASearchComponent, CourierLinkPipe],
	exports: [
		RMASearchComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		CuiSpinnerModule,
		GeneralSearchModule,
		I18nPipeModule,
	],
})
export class RMASearchModule { }
