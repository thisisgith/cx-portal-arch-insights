import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugDetailsComponent } from './bug-details.component';
import { DiagnosticsModule } from '@sdp-api';
import { environment } from '@environment';
import { BugDetailsHeaderModule } from './header/bug-details-header.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * The SDP Origin URL used for passing to the SDP-API Modules
 */
const rootUrl = environment.sdpServiceOrigin;

/**
 * Module representing our Bug Details Component
 */
@NgModule({
	declarations: [BugDetailsComponent],
	exports: [
		BugDetailsComponent,
		BugDetailsHeaderModule,
	],
	imports: [
		CommonModule,
		I18nPipeModule,
		BugDetailsHeaderModule,
		DiagnosticsModule.forRoot({ rootUrl }),
	],
})
export class BugDetailsModule { }
