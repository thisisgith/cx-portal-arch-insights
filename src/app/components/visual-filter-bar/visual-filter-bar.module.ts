import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { InlineSVGModule } from 'ng-inline-svg';

import { VisualFilterBarComponent } from './visual-filter-bar.component';
import { VisualFilterToggleComponent } from './visual-filter-toggle/visual-filter-toggle.component';

/**
 * Module to encapsulate VisualFilterBar component
 */
@NgModule({
	declarations: [VisualFilterBarComponent, VisualFilterToggleComponent],
	exports: [VisualFilterBarComponent, VisualFilterToggleComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		InlineSVGModule.forRoot({ baseUrl: '/' }),
	],
})
export class VisualFilterBarModule { }
