import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacetrackComponent } from './racetrack.component';

/**
 * RacetrackModule
 */
@NgModule({
	declarations: [RacetrackComponent],
	exports: [RacetrackComponent],
	imports: [
		CommonModule,
	],
})
export class RacetrackModule { }
