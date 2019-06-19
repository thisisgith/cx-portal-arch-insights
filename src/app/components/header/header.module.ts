import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SearchModule } from '../search/search.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderImportsModule } from './headerImports.module';
import { MicroMockModule } from '@cui-x-views/mock';

/**
 * Module representing the Header Component
 */
@NgModule({
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
	imports: [
		CommonModule,
		HeaderImportsModule,
		HttpClientModule,
		I18nPipeModule,
		MicroMockModule,
		SearchModule,
	],
})
export class HeaderModule { }
