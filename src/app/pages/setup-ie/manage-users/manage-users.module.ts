import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMgmtModule } from '@components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ManageUsersComponent } from './manage-users.component';

/**
 * Module for managing users
 */
@NgModule({
	declarations: [ManageUsersComponent],
	exports: [
		ManageUsersComponent,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
		UserMgmtModule,
	],
})
export class ManageUsersModule { }
