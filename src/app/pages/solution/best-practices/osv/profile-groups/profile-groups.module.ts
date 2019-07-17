import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileGroupsComponent } from './profile-groups.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTableModule, CuiDropdownModule } from '@cisco-ngx/cui-components';

@NgModule({
	declarations: [ProfileGroupsComponent],
	exports: [ProfileGroupsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTableModule,
		CuiDropdownModule,
	],
})
export class ProfileGroupsModule { }
