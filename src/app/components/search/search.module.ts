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
import { NoResultsModule } from './no-results/no-results.module';
import { SearchBarModule } from './search-bar/search-bar.module';
import { SpecialSearchModule } from './special-search/special-search.module';
import { RMASearchModule } from './rma-search/rma-search.module';
import {
	SearchModule as SearchServiceModule,
	ContractsModule,
	InventoryModule,
} from '@cui-x/sdp-api';
import { environment } from '@environment';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.services.sdp.origin;
import { SerialSearchModule } from './serial-search/serial-search.module';

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
		NoResultsModule,
		SearchBarModule,
		SpecialSearchModule,
		HttpClientModule,
		I18nPipeModule,
		SerialSearchModule,
		TruncatePipeModule,
		RouterModule,
		RMASearchModule,
		ContractsModule.forRoot({ rootUrl }),
		InventoryModule.forRoot({ rootUrl }),
		SearchServiceModule.forRoot({ rootUrl }),
	],
})
export class SearchModule { }
