import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsHeaderComponent } from './details-header.component';
import { OpenCasesModule } from './open-cases/open-cases.module';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the Details Header Component */
@NgModule({
	declarations: [DetailsHeaderComponent],
	exports: [DetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		OpenCasesModule,
		FromNowPipeModule,
	],
})
export class DetailsHeaderModule { }
