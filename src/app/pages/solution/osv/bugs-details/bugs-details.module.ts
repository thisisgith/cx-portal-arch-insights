import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugsDetailsComponent } from './bugs-details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiTableModule,
	CuiSpinnerModule,
	CuiTabsModule,
	CuiPagerModule,
	CuiSearchModule,
} from '@cisco-ngx/cui-components';
import { VisualFilterBarModule, PieChartModule } from '@components';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * bugs and psirts data
 */
@NgModule({
	declarations: [BugsDetailsComponent],
	exports: [BugsDetailsComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTabsModule,
		CuiSpinnerModule,
		CuiTableModule,
		VisualFilterBarModule,
		PieChartModule,
		CuiPagerModule,
		ReactiveFormsModule,
		CuiSearchModule,
	],
})
export class BugsDetailsModule { }
