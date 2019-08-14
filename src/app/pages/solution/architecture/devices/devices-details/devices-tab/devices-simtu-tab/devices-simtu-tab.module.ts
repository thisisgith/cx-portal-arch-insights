import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSimtuTabComponent } from './devices-simtu-tab.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { DevicesSimtuModule } from '../../devices-simtu/devices-simtu.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices Switch Interface MTU Tab */
@NgModule({
	declarations: [DevicesSimtuTabComponent],
	exports: [DevicesSimtuTabComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		DevicesSimtuModule,
		I18nPipeModule,
	],
})
export class DevicesSimtuTabModule { }
