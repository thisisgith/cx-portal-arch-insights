import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementDirective } from './entitlement.directive';

/**
 * TimelineComponent Module
 */
@NgModule({
	declarations: [
		EntitlementDirective,
	],
	exports: [
		EntitlementDirective,
	],
	imports: [
		CommonModule,
	],
})
export class EntitlementModule { }
