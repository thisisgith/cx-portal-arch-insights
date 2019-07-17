import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareVersionsComponent } from './software-versions.component';
import { CuiTableModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

@NgModule({
	declarations: [SoftwareVersionsComponent],
	exports: [SoftwareVersionsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		I18nPipeModule,
	],
})
export class SoftwareVersionsModule { }
