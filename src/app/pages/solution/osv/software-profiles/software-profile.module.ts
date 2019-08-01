import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareProfilesComponent } from './software-profile.component';
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
	declarations: [SoftwareProfilesComponent],
	exports: [SoftwareProfilesComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiDropdownModule,
		CuiSpinnerModule,
		CuiPagerModule,
	],
})
export class SoftwareProfilesModule { }
