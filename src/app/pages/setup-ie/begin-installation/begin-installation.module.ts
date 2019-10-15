import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BeginInstallationComponent } from './begin-installation.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { InlineSVGModule } from 'ng-inline-svg';

/**
 * Module to prompt beginning of IE installation
 */
@NgModule({
	declarations: [BeginInstallationComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		RouterModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
	],
})
export class BeginInstallationModule { }
