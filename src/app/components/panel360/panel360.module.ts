import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Panel360Component } from './panel360.component';
import { Panel360HeaderModule } from './panel360-header/panel360-header.module';
import { Panel360TitleDirective } from './directives/directives';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for the 360 detail panel component and its dependencies
 */
@NgModule({
	declarations: [
		Panel360Component,
		Panel360TitleDirective,
	],
	exports: [
		Panel360Component,
		Panel360HeaderModule,
		Panel360TitleDirective,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class Panel360Module { }
