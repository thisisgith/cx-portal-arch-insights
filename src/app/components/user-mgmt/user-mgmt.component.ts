import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { empty, Observable, Subject } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { ControlPointUserManagementAPIService, SADetails } from '@sdp-api';
import * as _ from 'lodash-es';

/** Sortable Columns */
type SortableColumn =  'companyName' | 'firstName';

/**
 * UserMgmtComponent
 */
@Component({
	selector: 'user-mgmt',
	styleUrls: ['./user-mgmt.component.scss'],
	templateUrl: './user-mgmt.component.html',
})
export class UserMgmtComponent implements AfterViewInit {
	@Output() private onUpdate = new EventEmitter<void>();
	private updateUsers$: Subject<SADetails[]> = new Subject<SADetails[]>();
	public error: boolean;
	public isLoading: boolean;
	public users$: Observable<SADetails[]> = this.updateUsers$
		.pipe(
			switchMap(() => this.getUsers()),
			map(response => {
				response.data = response.data.map(i => ({
					...i.user,
					roles: i.roles,
				}));

				return response;
			}),
			map(response => this.sort(response.data)),
		);
	public sortProps: { dir: 'asc' | 'desc'; column: SortableColumn; } = {
		column: 'firstName',
		dir: 'asc',
	};

	constructor (
		private cdr: ChangeDetectorRef,
		private usersService: ControlPointUserManagementAPIService,
	) { }

	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		this.updateUsers$.next();
	}

	/**
	 * Makes a request to get users
	 * @returns Observable
	 */
	private getUsers () {
		this.isLoading = true;
		this.cdr.detectChanges();

		return this.usersService.getUserDetailsListForGivenSAUsingGET('106200')
			.pipe(
				finalize(() => {
					this.isLoading = false;
					this.cdr.detectChanges();
				}),
				catchError(() => {
					this.error = true;

					return empty();
				}),
			);
	}

	/**
	 * Sets the sort from the table headers
	 * @param col - SortableColumn
	 */
	public setSort (col: SortableColumn) {
		if (this.sortProps.column === col) {
			if (this.sortProps.dir === 'asc') {
				this.sortProps.dir = 'desc';
			} else {
				this.sortProps.dir = 'asc';
			}
		} else {
			this.sortProps.dir = 'asc';
		}
		this.sortProps.column = col;
		this.updateUsers$.next();
	}

	/**
	 * Sorts on a selected column
	 * @param data - SADetails[]
	 * @returns sorted
	 */
	private sort (data: SADetails[]) {
		if (!this.sortProps) {
			return data;
		}
		const sorted = _.sortBy(data, this.sortProps.column);
		if (this.sortProps.dir === 'asc') {
			return sorted;
		}

		return _.reverse(sorted);
	}

	/**
	 * Update Button click handler
	 */
	public onUpdateClick () {
		this.onUpdate.emit();
	}
}
