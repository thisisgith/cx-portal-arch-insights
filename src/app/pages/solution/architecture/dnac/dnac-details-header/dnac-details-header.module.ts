import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnacDetailsHeaderComponent } from './dnac-details-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/** Module representing the DNAC Header Component */
@NgModule({
	declarations: [DnacDetailsHeaderComponent],
	exports: [DnacDetailsHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule
	],
})
export class DnacDetailsHeaderModule { }
