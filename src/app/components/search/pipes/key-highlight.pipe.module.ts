import { NgModule } from '@angular/core';
import { KeyHighlightPipe } from './key-highlight.pipe';

/**
 * Module to export KeyHighlightPipe
 */
@NgModule({
	declarations: [KeyHighlightPipe],
	exports: [KeyHighlightPipe],
})

export class KeyHighlightPipeModule { }
