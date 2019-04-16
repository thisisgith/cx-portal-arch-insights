import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SearchModule } from '@components/search/search.module';

/**
 * Module representing the Sidebar Component
 */
@NgModule({
	declarations: [SidebarComponent],
	exports: [SidebarComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		SearchModule,
	],
})
export class SidebarModule { }
