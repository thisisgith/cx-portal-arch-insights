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
@NgModule({
	declarations: [RccDeviceViolationDetailsComponent],
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
	exports: [RccDeviceViolationDetailsComponent]
})
export class RccDeviceViolationDetailsModule { }
