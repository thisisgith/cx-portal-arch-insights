import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RccDeviceViolationDetailsComponent } from './rcc-device-violation-details.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiSelectModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { RemoveInvalidTagsPipeModule } from '@pipes';
/**
 * Module representing Rcc track
 */
@NgModule({
	declarations: [RccDeviceViolationDetailsComponent],
	exports: [RccDeviceViolationDetailsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSearchModule,
		CuiSelectModule,
		CuiSpinnerModule,
		CuiAlertModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
		RemoveInvalidTagsPipeModule,
	],
})
export class RccDeviceViolationDetailsModule { }
