import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsibleComponent } from './collapsible.component';
import { HeightTransitionModule } from '../height-transition/height-transition.module';

/**
 * Module for collabsible component
 */
@NgModule({
	declarations: [CollapsibleComponent],
	exports: [CollapsibleComponent],
	imports: [
		CommonModule,

		HeightTransitionModule,
	],
})
export class CollapsibleModule { }
