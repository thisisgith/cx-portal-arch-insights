import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesDetailsHeaderComponent } from './devices-details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Devices Header Component */
@NgModule({
	declarations: [DevicesDetailsHeaderComponent],
	exports: [DevicesDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class DevicesDetailsHeaderModule { }
