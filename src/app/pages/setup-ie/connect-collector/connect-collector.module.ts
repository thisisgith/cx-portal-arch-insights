import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectCollectorComponent } from './connect-collector.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiSelectModule } from '@cisco-ngx/cui-components';

/**
 * Module for creating IE account
 */
@NgModule({
	declarations: [ConnectCollectorComponent],
	imports: [
		CommonModule,
		CuiSelectModule,
		I18nPipeModule,
		ReactiveFormsModule,
	],
})
export class ConnectCollectorModule { }
