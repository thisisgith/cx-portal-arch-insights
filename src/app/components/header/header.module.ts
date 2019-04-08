import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import {
	I18nPipeModule,
} from '@cisco-ngx/cui-pipes';
import { SearchModule } from '@components/search/search.module';

/**
 * Module representing the Header Component
 */
@NgModule({
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		SearchModule,
	],
})
export class HeaderModule { }
