import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareProfileComponent } from './software-profile.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTableModule, CuiDropdownModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';

/**
 * ProfileGroups Module
 */
@NgModule({
	declarations: [SoftwareProfileComponent],
	exports: [SoftwareProfileComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiDropdownModule,
		CuiSpinnerModule,
	],
})
export class SoftwareProfileModule { }
