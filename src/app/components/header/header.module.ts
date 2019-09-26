import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { HeaderDropdownModule } from './header-dropdown/header-dropdown.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SearchModule } from '../search/search.module';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { InlineSVGModule } from 'ng-inline-svg';

/**
 * Module representing the Header Component
 */
@NgModule({
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
	imports: [
		CommonModule,
		HeaderDropdownModule,
		HttpClientModule,
		I18nPipeModule,
		MicroMockModule,
		RouterModule,
		SearchModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
	],
})
export class HeaderModule { }
