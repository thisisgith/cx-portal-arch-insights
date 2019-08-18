import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashHistoryComponent } from './crash-history.component';
import { I18nPipeModule, FromNowPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Crash History component
 */
@NgModule({
	declarations: [CrashHistoryComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		FromNowPipeModule,
	],
	// tslint:disable-next-line: object-literal-sort-keys
	exports: [
		CrashHistoryComponent,
	],
})
export class CrashHistoryModule { }
