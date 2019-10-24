import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserMgmtModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

import { AdminWrapperModule } from '../admin-wrapper.module';
import { UsersComponent } from './users.component';

/**
 * Module Imports
 */
const imports = [
	AdminWrapperModule,
	CommonModule,
	I18nPipeModule,
	RouterModule,
	UserMgmtModule,
];

/**
 * Main Settings module
 */
@NgModule({
	imports,
	declarations: [
		UsersComponent,
	],
})
export class UsersModule { }
