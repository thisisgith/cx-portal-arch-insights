import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectRoleComponent } from './select-role.component';
import { RolesService } from './roles.service';

/**
 * SelectRoleModule
 */
@NgModule({
	declarations: [
		SelectRoleComponent,
	],
	exports: [
		SelectRoleComponent,
	],
	imports: [
		CommonModule,
	],
	providers: [
		RolesService,
	],
})
export class SelectRoleModule { }
