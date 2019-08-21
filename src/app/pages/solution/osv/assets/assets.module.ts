import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import {
	CuiTableModule,
	CuiDropdownModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiModalModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ContactSupportModule } from 'src/app/components/contact-support/contact-support.module';

/**
 * AssetModule
 */
@NgModule({
	declarations: [AssetsComponent],
	exports: [AssetsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		CuiDropdownModule,
		I18nPipeModule,
		CuiPagerModule,
		CuiSpinnerModule,
		CuiModalModule,
		ContactSupportModule,
	],
})
export class AssetsModule { }
