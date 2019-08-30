import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacListComponent } from './dnac-list.component';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule,
	CuiDropdownModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';

/** Module representing the Devices With Exceptions Component */
@NgModule({
	declarations: [DnacListComponent],
	exports : [DnacListComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiTableModule,
		CuiPagerModule,
		I18nPipeModule,
		CuiSpinnerModule,
		FormsModule,
	],
})
export class DnacListModule { }