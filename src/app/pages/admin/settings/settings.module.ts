import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { HeightTransitionModule } from '@components';
import { AppStatusColorPipe } from './app-status-color.pipe';
import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

import {
	CuiGaugeModule,
	CuiLoaderModule,
	CuiSidebarModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

/**
 * Main Settings module
 */
@NgModule({
	declarations: [
		AppStatusColorPipe,
		ResourceGaugeColorPipe,
		SettingsComponent,
	],
	imports: [
		AdminWrapperModule,
		CommonModule,
		CuiGaugeModule,
		CuiLoaderModule,
		HeightTransitionModule,
		I18nPipeModule,
		CuiSidebarModule,
		CuiSpinnerModule,
	],
})
export class SettingsModule { }
