import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFilesComponent } from './case-files.component';
import {
	CuiSpinnerModule,
	CuiTableModule,
} from '@cisco-ngx/cui-components';
import { I18nPipeModule, FileSizePipeModule } from '@cisco-ngx/cui-pipes';
import { DownloadLinkPipe } from './pipes/download-link.pipe';

/**
 * CaseFiles Module
 */
@NgModule({
	declarations: [CaseFilesComponent, DownloadLinkPipe],
	exports: [
		CaseFilesComponent,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiSpinnerModule,
		CuiTableModule,
		FileSizePipeModule,
	],
})
export class CaseFilesModule { }
