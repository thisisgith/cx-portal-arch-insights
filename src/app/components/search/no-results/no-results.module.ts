import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultsComponent } from './no-results.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module to export no results component
 */
@NgModule({
	declarations: [NoResultsComponent],
	exports: [NoResultsComponent],
	imports: [
		CommonModule,

		I18nPipeModule,
	],
})
export class NoResultsModule { }
