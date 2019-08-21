import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { TooltipHostDirective } from './tooltip-host.directive';

/**
 * TimelineComponent Module
 */
@NgModule({
	declarations: [
		TooltipComponent,
		TooltipDirective,
		TooltipHostDirective,
	],
	entryComponents: [TooltipComponent],
	exports: [
		TooltipComponent,
		TooltipDirective,
		TooltipHostDirective,
	],
	imports: [
		CommonModule,
	],
})
export class TooltipModule { }
