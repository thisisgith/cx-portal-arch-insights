import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {
	I18nPipeModule, TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { SearchService } from '@services';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GeneralSearchModule } from './general-search/general-search.module';
import { SearchBarModule } from './search-bar/search-bar.module';

/**
 * Module representing the Search Component
 */
@NgModule({
	declarations: [
		SearchComponent,
	],
	exports: [SearchComponent],
	imports: [
		CommonModule,
		GeneralSearchModule,
		SearchBarModule,

		HttpClientModule,
		I18nPipeModule,
		TruncatePipeModule,
		RouterModule,
	],
	providers: [SearchService],
})
export class SearchModule { }
