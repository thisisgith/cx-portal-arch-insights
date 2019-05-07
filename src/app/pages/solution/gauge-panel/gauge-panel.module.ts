import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugePanelComponent } from './gauge-panel.component';
import { RouterModule } from '@angular/router';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { FormsModule } from '@angular/forms';

/**
 * Module representing the solutions gauge-panel
 */
@NgModule({
	declarations: [GaugePanelComponent],
	exports: [GaugePanelComponent],
	imports: [
		CommonModule,
		RouterModule,
		I18nPipeModule,
		CuiGaugeModule,
		FormsModule,
	],
})
export class GaugePanelModule { }
