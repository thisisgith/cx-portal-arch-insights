import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderDropdownComponent } from './header-dropdown.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Header Component
 */
@NgModule({
	declarations: [HeaderDropdownComponent],
	exports: [HeaderDropdownComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class HeaderDropdownModule { }
