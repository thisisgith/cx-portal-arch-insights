import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsHardwareComponent } from './details-hardware.component';
import { CuiLoaderModule, CuiDrawersModule, CuiDrawerModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsHeaderModule } from '../details-header/details-header.module';
import { TimelineModule } from '@components';

/** Module representing the Hardware Details Component */
@NgModule({
	declarations: [DetailsHardwareComponent],
	exports: [DetailsHardwareComponent],
	imports: [
		CommonModule,
		CuiLoaderModule,
		I18nPipeModule,
		CuiDrawersModule,
		CuiDrawerModule,
		DetailsHeaderModule,
		TimelineModule,
	],
})
export class DetailsHardwareModule { }
