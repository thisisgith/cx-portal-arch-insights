import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { DevicesL3TabComponent } from './devices-l3-tab.component';
import { DevicesL3Module } from '../../devices-l3/devices-l3.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices L3 Access Switching Tab */
@NgModule({
	declarations: [DevicesL3TabComponent],
	exports: [DevicesL3TabComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		DevicesL3Module,
		I18nPipeModule		
	],
})
export class DevicesL3TabModule { }
