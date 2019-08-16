import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarCell } from './policy-calendar.types';
import { DatePipe } from '@angular/common';
import {
	ControlPointDevicePolicyAPIService,
	PoliciesGroupByDayInAMonthModel,
} from '@sdp-api';
import {
	CalendarCellTooltipComponent,
} from './calendar-cell-tooltip/calendar-cell-tooltip.component';
import { User } from '@interfaces';

import { empty, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';

/** number of cells in the calendar */
const MAX_CELLS = 42;

/**
 * PolicyCalendarComponent
 */
@Component({
	providers: [DatePipe],
	selector: 'policy-calendar',
	styleUrls: ['./policy-calendar.component.scss'],
	templateUrl: './policy-calendar.component.html',
})
export class PolicyCalendarComponent implements OnDestroy, OnInit {
	private customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();
	private refreshMonth$: Subject<void> = new Subject<void>();
	private user: User;

	/** negative index is previous month, positive is future month */
	public cells: CalendarCell[] = [];
	public currentMonthName: string;
	public currentYear: number;
	public loading: boolean;
	public monthData: PoliciesGroupByDayInAMonthModel[];
	public monthIndex = 0;
	public calendarCellTooltip = CalendarCellTooltipComponent;

	constructor (
		private cpService: ControlPointDevicePolicyAPIService,
		private datePipe: DatePipe,
		private route: ActivatedRoute,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.refreshMonth$
			.pipe(
				tap(() => this.loading = true),
				switchMap(() => this.getMonthData()),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.loading = false;
				this.monthData = response;
				this.getCalendarCells();
			});

		this.initCalendarCells();
		this.refreshMonth$.next();

	}

	/**
	 * Fills in the cells array with blank values
	 */
	private initCalendarCells () {
		// Fills in calendar with blank cells
		this.cells = [];
		for (let i = 0; i < MAX_CELLS; i += 1) {
			this.cells.push({ isBlankCell: true });
		}
	}

	/**
	 * Computes calendar cells from the number of days in the month given by monthIndex
	 */
	private getCalendarCells () {
		const today = new Date();
		today.setMonth(today.getMonth() + this.monthIndex);
		const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
		const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		let dayOfMonth = 1;
		for (let i = firstDay.getDay(); i < lastDay.getDate() + firstDay.getDay(); i += 1) {
			const dayData = _.get(this, ['monthData', dayOfMonth - 1], { });
			this.cells[i].isBlankCell = false;
			this.cells[i].date = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
			this.cells[i].dayOfMonth = dayOfMonth;
			this.cells[i].policies = _.get(dayData, 'policyList', []);
			this.cells[i].hasCollection = dayData.hasCollection;
			this.cells[i].hasIgnore = dayData.hasIgnore;
			this.cells[i].hasScan = dayData.hasScan;
			if (this.monthIndex === 0 && dayOfMonth === today.getDate()) {
				// for marking the current day in the calendar
				this.cells[i].isToday = true;
			}
			dayOfMonth += 1;
		}
		this.currentMonthName = this.datePipe.transform(today, 'MMM');
		this.currentYear = today.getFullYear();
	}

	/**
	 * Goes to next month
	 */
	public nextMonth () {
		this.monthIndex += 1;
		this.initCalendarCells();
		this.refreshMonth$.next();
	}

	/**
	 * Goes to previous month
	 */
	public prevMonth () {
		this.monthIndex -= 1;
		this.initCalendarCells();
		this.refreshMonth$.next();
	}

	/**
	 * Gets data for current month
	 * @returns Observable
	 */
	public getMonthData () {
		const today = new Date();
		today.setMonth(today.getMonth() + this.monthIndex);

		return this.cpService
			.getAllPolicyForGivenMonthUsingGET({
				customerId: this.customerId,
				month: this.datePipe.transform(today, 'MM'),
				year: this.datePipe.transform(today, 'yyyy'),
			})
			.pipe(
				map(response => {
					_.each(response, day => {
						if (_.some(day.policyList, pol => pol.policyType === 'SCAN')) {
							day.hasScan = true;
						}
						if (_.some(day.policyList, pol => pol.policyType === 'COLLECTION')) {
							day.hasCollection = true;
						}
						if (_.some(day.policyList, pol => pol.policyType === 'IGNORE')) {
							day.hasIgnore = true;
						}

					});

					return response;
				}),
				catchError(() => {
					this.loading = false;
					this.monthData = [];
					this.getCalendarCells();

					return empty();
				}),
			);
	}
}
