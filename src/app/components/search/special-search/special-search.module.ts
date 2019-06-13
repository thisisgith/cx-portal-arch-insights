import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialSearchComponent } from './special-search.component';

/**
 * Module for abstract special search content
 */
@NgModule({
	declarations: [SpecialSearchComponent],
	exports: [SpecialSearchComponent],
	imports: [
		CommonModule,
	],
})
export class SpecialSearchModule { }
