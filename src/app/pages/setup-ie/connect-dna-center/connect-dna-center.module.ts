import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectDNACenterComponent } from './connect-dna-center.component';
import { AlertModule, HeightTransitionModule } from '@components';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import {
	CuiModalModule,
	CuiSelectModule,
	CuiSpinnerModule,
} from '@cisco-ngx/cui-components';

/**
 * Module for creating IE account
 */
@NgModule({
	declarations: [ConnectDNACenterComponent],
	imports: [
		AlertModule,
		CommonModule,
		CuiModalModule,
		CuiSelectModule,
		HeightTransitionModule,
		I18nPipeModule,
		ReactiveFormsModule,
		CuiSpinnerModule,
	],
})
export class ConnectDNACenterModule { }
