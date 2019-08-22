import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RccDeviceViolationDetailsComponent } from './rcc-device-violation-details.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSearchModule,
	CuiSelectModule,
} from '@cisco-ngx/cui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
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
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class RccDeviceViolationDetailsModule { }
