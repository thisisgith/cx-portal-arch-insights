import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {
	I18nPipeModule, TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ContractSearchModule } from './contract-search/contract-search.module';
import { GeneralSearchModule } from './general-search/general-search.module';
import { SearchBarModule } from './search-bar/search-bar.module';
import { SpecialSearchModule } from './special-search/special-search.module';
import { SearchModule as SearchServiceModule } from '@cui-x/sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpOrigin;

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
		ContractSearchModule,
		GeneralSearchModule,
		SearchBarModule,
		SpecialSearchModule,

		HttpClientModule,
		I18nPipeModule,
		TruncatePipeModule,
		RouterModule,
		SearchServiceModule.forRoot({ rootUrl }),
	],
})
export class SearchModule { }
