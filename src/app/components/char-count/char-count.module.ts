import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharCountComponent } from './char-count.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * CharCount module
 */
@NgModule({
	declarations: [CharCountComponent],
	exports: [CharCountComponent],
	imports: [
		CommonModule,

		I18nPipeModule,
	],
})
export class CharCountModule { }
