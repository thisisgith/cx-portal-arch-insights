import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesPipe } from './matches.pipe';

/**
 * Export MatchesPipe
 */
@NgModule({
	declarations: [MatchesPipe],
	exports: [MatchesPipe],
	imports: [
		CommonModule,
	],
})
export class MatchesPipeModule { }
