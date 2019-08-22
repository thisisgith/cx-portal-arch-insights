import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickTourComponent, ArrowPipe, TimesPipe } from './quick-tour.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * QuickTourModule
 */
@NgModule({
	declarations: [QuickTourComponent, ArrowPipe, TimesPipe],
	exports: [QuickTourComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class QuickTourModule { }
