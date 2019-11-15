import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from './tag-list.component';
import { FromNowPipeModule, I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

/**
 * Module representing form for Policies page
 */
@NgModule({
	declarations: [TagListComponent],
	exports: [TagListComponent],
	imports: [
		CommonModule,
		FromNowPipeModule,
		I18nPipeModule,
		CuiLoaderModule,
	],
})
export class TagListModule { }
