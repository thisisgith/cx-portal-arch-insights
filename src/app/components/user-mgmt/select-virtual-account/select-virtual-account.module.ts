import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectVirtualAccountComponent } from './select-virtual-account.component';
/**
 * SelectRoleModule
 */
@NgModule({
	declarations: [
		SelectVirtualAccountComponent,
	],
	exports: [
		SelectVirtualAccountComponent,
	],
	imports: [
		CommonModule,
	],
})
export class SelectVirtualAccountModule { }
