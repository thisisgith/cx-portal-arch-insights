import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results.component';

/**
 * Module representing the Search Results Component
 */
@NgModule({
	declarations: [SearchResultsComponent],
	entryComponents: [SearchResultsComponent],
	exports: [SearchResultsComponent],
	imports: [CommonModule],
})
export class SearchResultsModule { }
