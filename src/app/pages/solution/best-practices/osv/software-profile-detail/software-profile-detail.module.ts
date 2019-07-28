import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwarProfileDetailComponent } from './software-profile-detail.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AssetsBarChartModule } from '../../../assets/assets-bar-chart/assets-bar-chart.module';

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
		AssetsBarChartModule,
	],
})
export class SoftwareProfileDetailModule { }
