import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharCountComponent } from './char-count.component';

/**
 * CharCount module
 */
@NgModule({
	declarations: [CharCountComponent],
	exports: [CharCountComponent],
	imports: [
		CommonModule,
	],
})
export class CharCountModule { }
