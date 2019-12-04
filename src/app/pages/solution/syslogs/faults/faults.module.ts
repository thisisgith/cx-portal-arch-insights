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
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { FaultDetailsModule } from '../fault-details/fault-details.module';

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
		CuiAlertModule,
		FaultDataModule.forRoot({ rootUrl }),
		CuiSpinnerModule,
		FaultDetailsModule,
	],
})
export class FaultsModule { }
