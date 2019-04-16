import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugePanelComponent } from './gauge-panel.component';
import { RouterModule } from '@angular/router';
import { CuiGaugeModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the Gauge Panel Component
 */
@NgModule({
	declarations: [GaugePanelComponent],
	exports: [GaugePanelComponent],
	imports: [
		CommonModule,
		CuiGaugeModule,
		I18nPipeModule,
		RouterModule,
	],
})
export class GaugePanelModule { }
