import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwarProfileDetailComponent } from './software-profile-detail.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * SoftwareProfileDetail Module
 */
@NgModule({
	declarations: [SoftwarProfileDetailComponent],
	exports: [SoftwarProfileDetailComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
	],
})
export class SoftwareProfileDetailModule { }
