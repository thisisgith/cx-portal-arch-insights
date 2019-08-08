import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderDropdownComponent } from './header-dropdown.component';

/**
 * Module representing the Header Component
 */
@NgModule({
	declarations: [HeaderDropdownComponent],
	exports: [HeaderDropdownComponent],
	imports: [CommonModule],
})
export class HeaderDropdownModule { }
