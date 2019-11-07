import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserMgmtComponent } from './user-mgmt.component';
import { UserInitialsPipe } from './user-initials.pipe';
import { CuiDropdownModule, CuiLoaderModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { SelectRoleModule } from './select-role/select-role.module';
import { UserMgmtSortPipe } from './user-mgmt-sort.pipe';
import { UserMgmtFilterPipe } from './user-mgmt-filter.pipe';

/**
 * UserMgmtModule
 */
@NgModule({
	declarations: [
		UserInitialsPipe,
		UserMgmtComponent,
		UserMgmtFilterPipe,
		UserMgmtSortPipe,
	],
	exports: [UserMgmtComponent],
	imports: [
		CommonModule,
		CuiDropdownModule,
		CuiLoaderModule,
		FormsModule,
		I18nPipeModule,
		SelectRoleModule,
	],
})
export class UserMgmtModule { }
