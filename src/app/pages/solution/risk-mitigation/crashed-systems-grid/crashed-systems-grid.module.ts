import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashedSystemsGridComponent } from './crashed-systems-grid.component';
import {
	CuiTableModule,
	CuiPagerModule,
	CuiSpinnerModule,
	CuiAlertModule,
} from '@cisco-ngx/cui-components';
import { RMModule } from '@sdp-api';
import { environment } from '@environment';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CrashHistoryDetailsModule } from '../crash-history-details/crash-history-details.module';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Crashed Systems module to show table of crashed systems.
 */
@NgModule({
	declarations: [CrashedSystemsGridComponent],
	exports: [CrashedSystemsGridComponent],
	imports: [
		CommonModule,
		CrashHistoryDetailsModule,
		CuiTableModule,
		CuiPagerModule,
		CuiSpinnerModule,
		I18nPipeModule,
		CuiAlertModule,
		RMModule.forRoot({ rootUrl }),
	],

})
export class CrashedSystemsGridModule { }
