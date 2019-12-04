import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementDirective } from '@directives';

@NgModule({
	declarations: [
		EntitlementDirective,
	],
	imports: [
		CommonModule,
	],
	exports: [
		EntitlementDirective,
	],
})
export class SharedModule { }
