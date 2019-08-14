import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacListComponent } from './dnac-list.component';
import { CuiTableModule, CuiPagerModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { DetailsPanelModule } from '@components';
import { DnacDetailsModule } from '../dnac/dnac-details/dnac-details.module';
import { DnacDetailsHeaderModule } from '../dnac/dnac-details-header/dnac-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the CBP Rule Violation Component */
@NgModule({
	declarations: [DnacListComponent],
	exports: [DnacListComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiPagerModule,
		DetailsPanelModule,
		CuiLoaderModule,
		I18nPipeModule,
		DnacDetailsModule,
		DnacDetailsHeaderModule,
	],
})
export class DnacListModule { }
