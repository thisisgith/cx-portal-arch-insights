import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { HeightTransitionModule } from '../height-transition/height-transition.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module for the AlertComponent
 */
@NgModule({
	declarations: [
		AlertComponent,
	],
	exports: [
		AlertComponent,
	],
	imports: [
		CommonModule,
		HeightTransitionModule,
		I18nPipeModule,
	],
})
export class AlertModule { }
