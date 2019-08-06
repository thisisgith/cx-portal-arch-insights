import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoDNACHeaderComponent } from './no-dnac-header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the SubHeader
 */
@NgModule({
	declarations: [NoDNACHeaderComponent],
	exports: [NoDNACHeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		RouterModule,
	],
})
export class NoDNACHeaderModule { }
