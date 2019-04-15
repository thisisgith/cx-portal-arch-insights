import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent, HighlightPipe } from './search.component';
import {
	I18nPipeModule, TruncatePipeModule,
} from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from './search.service';
import { CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { HttpClientModule } from '@angular/common/http';

/**
 * Module representing the Search Component
 */
@NgModule({
	declarations: [
		HighlightPipe,
		SearchComponent,
	],
	exports: [SearchComponent],
	imports: [
		CommonModule,
		CuiSpinnerModule,
		FormsModule,
		HttpClientModule,
		I18nPipeModule,
		ReactiveFormsModule,
		TruncatePipeModule,
	],
	providers: [SearchService],
})
export class SearchModule { }
