import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacListComponent } from './dnac-list.component';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule,
	CuiDropdownModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';
import { DnacDetailsModule } from '../dnac-details/dnac-details.module';

/** Module representing the Devices With Exceptions Component */
@NgModule({
	declarations: [DnacListComponent],
	exports : [DnacListComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		DnacDetailsModule,
		I18nPipeModule,
		CuiSpinnerModule,
		FormsModule,
	],
})
export class DnacListModule { }
