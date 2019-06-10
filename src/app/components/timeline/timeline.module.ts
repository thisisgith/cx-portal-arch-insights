import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * TimelineComponent Module
 */
@NgModule({
	declarations: [
		TimelineComponent,
	],
	exports: [TimelineComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class TimelineModule { }
