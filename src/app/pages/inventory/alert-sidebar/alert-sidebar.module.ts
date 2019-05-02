import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSidebarComponent } from './alert-sidebar.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module used for importing our AlertSidebarComponent
 */
@NgModule({
	declarations: [AlertSidebarComponent],
	exports: [AlertSidebarComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		FromNowPipeModule,
	],
})
export class AlertSidebarModule { }
