import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { RacetrackComponent } from './racetrack.component';

@NgModule({
	declarations: [RacetrackComponent],
	exports: [RacetrackComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class RacetrackComponentModule { }
