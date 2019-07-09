import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedRmaComponent } from './related-rma.component';

/**
 * Related RMA list Module
 */
@NgModule({
	declarations: [RelatedRmaComponent],
	exports: [RelatedRmaComponent],
	imports: [
		CommonModule,
	],
})
export class RelatedRmaModule { }
