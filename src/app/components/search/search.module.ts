import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {
	I18nPipeModule,
} from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultsModule } from './search-results/search-results.module';

/**
 * Module representing the Search Component
 */
@NgModule({
	declarations: [SearchComponent],
	exports: [SearchComponent],
	imports: [
		CommonModule,
		FormsModule,
		I18nPipeModule,
		ReactiveFormsModule,
		SearchResultsModule,
	],
})
export class SearchModule { }
