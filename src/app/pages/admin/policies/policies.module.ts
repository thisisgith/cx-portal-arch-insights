import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies.component';

import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { AdminWrapperModule } from '../admin-wrapper.module';
import { ControlPointsModule, UserModule } from '@sdp-api';
import { environment } from '@environment';
import { CuiLoaderModule } from '@cisco-ngx/cui-components';

import { PolicyFormModule } from './policy-form/policy-form.module';
import { PolicyCalendarComponent } from './policy-calendar/policy-calendar.component';
import {
	CalendarCellTooltipComponent,
} from './policy-calendar/calendar-cell-tooltip/calendar-cell-tooltip.component';

import { TooltipModule } from '@components';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Main Policies module
 */
@NgModule({
	declarations: [
		CalendarCellTooltipComponent,
		PoliciesComponent,
		PolicyCalendarComponent,
	],
	entryComponents: [CalendarCellTooltipComponent],
	imports: [
		AdminWrapperModule,
		CommonModule,
		ControlPointsModule.forRoot({ rootUrl }),
		CuiLoaderModule,
		I18nPipeModule,
		PolicyFormModule,
		RouterModule,
		TooltipModule,
		UserModule.forRoot({ rootUrl }),
	],
})
export class PoliciesModule { }
