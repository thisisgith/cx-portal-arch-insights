import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchesPipeModule } from '../pipes/matches.pipe.module';

import {
	I18nPipeModule, TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';

import { SearchBarComponent } from './search-bar.component';

/**
 * Module for search bar with typeahead
 */
@NgModule({
	declarations: [SearchBarComponent],
	exports: [
		SearchBarComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		I18nPipeModule,
		TruncatePipeModule,

		MatchesPipeModule,
	],
})
export class SearchBarModule { }
