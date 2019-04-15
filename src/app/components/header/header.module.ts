import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import {
	I18nPipeModule,
} from '@cisco-ngx/cui-pipes';
import { SearchModule } from '@components/search/search.module';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { HttpClientModule } from '@angular/common/http';

/**
 * List of imports
 */
const imports = [
	CommonModule,
	HttpClientModule,
	I18nPipeModule,
	SearchModule,
];

if (environment.mock) {
	imports.push(MicroMockModule);
}

/**
 * Module representing the Header Component
 */
@NgModule({
	imports,
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
})
export class HeaderModule { }
