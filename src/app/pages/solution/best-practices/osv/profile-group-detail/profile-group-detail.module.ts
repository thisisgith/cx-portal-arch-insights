import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileGroupDetailComponent } from './profile-group-detail.component';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

@NgModule({
	declarations: [ProfileGroupDetailComponent],
	exports: [ProfileGroupDetailComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
	],
})
export class ProfileGroupDetailModule { }
