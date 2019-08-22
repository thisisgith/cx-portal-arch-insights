import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedUserComponent } from './unauthorized-user.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for confirm close modal component
 */
@NgModule({
	declarations: [UnauthorizedUserComponent],
	entryComponents: [UnauthorizedUserComponent],
	exports: [UnauthorizedUserComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class UnauthorizedUserModule { }
