import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserMgmtComponent } from './user-mgmt.component';
import {
	CuiDropdownModule,
	CuiLoaderModule,
	CuiModalModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SelectRoleModule } from './select-role/select-role.module';
import { UserMgmtSortPipe } from './user-mgmt-sort.pipe';
import { UserMgmtFilterPipe } from './user-mgmt-filter.pipe';
import { AlertModule } from '../alert/alert.module';
import { AddUserModule } from '../add-user/add-user.module';
import { SelectVirtualAccountModule } from './select-virtual-account/select-virtual-account.module';
import { TooltipModule } from '../tooltip/tooltip.module';

/**
 * UserMgmtModule
 */
@NgModule({
	declarations: [
		UserMgmtComponent,
		UserMgmtFilterPipe,
		UserMgmtSortPipe,
	],
	exports: [UserMgmtComponent],
	imports: [
		AlertModule,
		AddUserModule,
		CommonModule,
		CuiDropdownModule,
		CuiLoaderModule,
		CuiModalModule,
		FormsModule,
		I18nPipeModule,
		SelectRoleModule,
		SelectVirtualAccountModule,
		TooltipModule,
	],
})
export class UserMgmtModule { }
