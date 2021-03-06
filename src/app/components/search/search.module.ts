import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {
	I18nPipeModule, TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CaseModule } from '../case/case.module';
import { CaseSearchModule } from './case-search/case-search.module';
import { ContractSearchModule } from './contract-search/contract-search.module';
import { GeneralSearchModule } from './general-search/general-search.module';
import { NoResultsModule } from './no-results/no-results.module';
import { SearchBarModule } from './search-bar/search-bar.module';
import { SerialSearchModule } from './serial-search/serial-search.module';
import { SpecialSearchModule } from './special-search/special-search.module';
import { RMASearchModule } from './rma-search/rma-search.module';
import {
	ProductAlertsModule,
	SearchModule as SearchServiceModule,
	ContractsModule,
	InventoryModule,
} from '@sdp-api';
import { environment } from '@environment';
import { AssetDetailsModule } from '@components';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

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

		CaseModule,
		CaseSearchModule,
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
		ProductAlertsModule.forRoot({ rootUrl }),
		SearchServiceModule.forRoot({ rootUrl }),
		InventoryModule.forRoot({ rootUrl }),
		AssetDetailsModule,
	],
})
export class SearchModule { }
