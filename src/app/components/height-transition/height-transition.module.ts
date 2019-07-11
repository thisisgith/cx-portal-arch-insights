import { NgModule } from '@angular/core';
import { HeightTransitionDirective } from './height-transition.directive';

/**
 * RacetrackModule
 */
@NgModule({
	declarations: [HeightTransitionDirective],
	exports: [HeightTransitionDirective],
})
export class HeightTransitionModule { }
