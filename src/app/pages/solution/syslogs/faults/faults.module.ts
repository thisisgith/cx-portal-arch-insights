import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaultsComponent } from './faults.component';
import { environment } from '@environment';
import { FaultDataModule } from '@sdp-api';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTabsModule,
	CuiTableModule,
	CuiPagerModule,
	CuiDropdownModule,
	CuiSpinnerModule,
	CuiSearchModule,
	CuiToastModule,
} from '@cisco-ngx/cui-components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing the Syslog component of the Solution Page
 */
@NgModule({
	declarations: [FaultsComponent],
	exports: [FaultsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CuiDropdownModule,
		I18nPipeModule,
		CuiTabsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSearchModule,
		CuiToastModule,
		FaultDataModule.forRoot({ rootUrl }),
		CuiSpinnerModule,
	],
})
export class FaultsModule { }