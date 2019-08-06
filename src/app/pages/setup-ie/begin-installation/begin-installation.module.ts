import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeginInstallationComponent } from './begin-installation.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module to prompt beginning of IE installation
 */
@NgModule({
	declarations: [BeginInstallationComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class BeginInstallationModule { }
