import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * SoftwareGroupDetail Module
 */
@NgModule({
	declarations: [SoftwareGroupDetailComponent],
	exports: [SoftwareGroupDetailComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
	],
})
export class SoftwareGroupDetailModule { }
