import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCasesComponent } from './open-cases.component';
import { CuiTableModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule } from '@angular/forms';

/**
 * Open case list module
 */
@NgModule({
	declarations: [OpenCasesComponent],
	exports: [OpenCasesComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		I18nPipeModule,
		FormsModule,
		FromNowPipeModule,
	],
})
export class OpenCasesModule { }
