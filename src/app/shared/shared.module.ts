import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementDirective, ClickOutsideDirective } from '@directives';

@NgModule({
	declarations: [
		EntitlementDirective,
		ClickOutsideDirective,
	],
	imports: [
		CommonModule,
	],
	exports: [
		EntitlementDirective,
		ClickOutsideDirective,
	],
})
export class SharedModule { }
