import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareGroupsComponent } from './software-groups.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTableModule,
	CuiDropdownModule,
	CuiSpinnerModule,
	CuiPagerModule,
} from '@cisco-ngx/cui-components';

/**
 * ProfileGroups Module
 */
@NgModule({
	declarations: [SoftwareGroupsComponent],
	exports: [SoftwareGroupsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiDropdownModule,
		CuiSpinnerModule,
		CuiPagerModule,
	],
})
export class SoftwareGroupsModule { }
