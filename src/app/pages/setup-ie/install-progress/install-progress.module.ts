import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallProgressComponent } from './install-progress.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * InstallProgressModule
 */
@NgModule({
	declarations: [
		InstallProgressComponent,
	],
	exports: [
		InstallProgressComponent,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class InstallProgressModule { }
