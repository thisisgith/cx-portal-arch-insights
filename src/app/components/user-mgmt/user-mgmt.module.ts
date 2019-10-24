import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMgmtComponent } from './user-mgmt.component';
import { UserInitialsPipe } from './user-initials.pipe';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SelectRoleModule } from './select-role/select-role.module';

/**
 * UserMgmtModule
 */
@NgModule({
	declarations: [
		UserInitialsPipe,
		UserMgmtComponent,
	],
	exports: [UserMgmtComponent],
	imports: [
		CommonModule,
		CuiLoaderModule,
		I18nPipeModule,
		SelectRoleModule,
	],
})
export class UserMgmtModule { }
