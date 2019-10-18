import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarCell } from '../policy-calendar.types';
import cronstrue from 'cronstrue';
import * as _ from 'lodash-es';

/**
 * Policy Info for each row in the tooltip
 */
export interface PolicyInfo {
	numDevices?: number;
	time: string;
	policyType: 'IGNORE' | 'SCAN' | 'COLLECTION';
}

/**
 * CalendarCellTooltipComponent
 */
@Component({
	selector: 'calendar-cell-tooltip',
	styleUrls: ['./calendar-cell-tooltip.component.scss'],
	templateUrl: './calendar-cell-tooltip.component.html',
})
export class CalendarCellTooltipComponent implements OnInit {
	public data: CalendarCell;
	public dailies: PolicyInfo[] = [];
	public weeklies: PolicyInfo[] = [];
	public monthlies: PolicyInfo[] = [];

	constructor (
		private datePipe: DatePipe,
	) { }

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.parsePolicySchedules();
	}

	/**
	 * Parses the policy schedules, groups by daily/weekly/monthly
	 */
	private parsePolicySchedules () {
		_.each(this.data.policies, policy => {
			const schedString = cronstrue.toString(policy.schedule);
			const timeRegex = /(\d{2}:\d{2} [AP]M)/;
			const monthRegex = /on\sday\s\d{1,2}\sof\sthe\smonth/;
			const weekRegex = /only\son\s/;
			if (monthRegex.test(schedString)) {
				this.monthlies.push({
					numDevices: policy.deviceCount,
					policyType: policy.policyType,
					time: _.get(schedString.match(timeRegex), '[1]'),
				});
			} else if (weekRegex.test(schedString)) {
				this.weeklies.push({
					numDevices: policy.deviceCount,
					policyType: policy.policyType,
					time: _.get(schedString.match(timeRegex), '[1]'),
				});
			} else {
				this.dailies.push({
					numDevices: policy.deviceCount,
					policyType: policy.policyType,
					time: _.get(schedString.match(timeRegex), '[1]'),
				});
			}
		});
	}
}
