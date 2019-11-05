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
import { SortableColumn, SortProps } from './user-mgmt.types';

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
			map(response => response.data),
		);
	public sortProps: SortProps = {
		column: 'firstName',
		dir: 'asc',
	};
	public filter: string;

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
				this.setSortProps({ dir: 'desc' });
			} else {
				this.setSortProps({ dir: 'asc' });
			}
		} else {
			this.setSortProps({ dir: 'asc' });
		}
		this.setSortProps({ column: col });
	}

	/**
	 * Update Button click handler
	 */
	public onUpdateClick () {
		this.onUpdate.emit();
	}

	/**
	 * Sets the sortProps field
	 * @param sortProps SortProps
	 */
	private setSortProps (sortProps: Partial<SortProps>) {
		// need to reassign sortProps object for pure pipe to detect changes
		this.sortProps = {
			column: sortProps.column || this.sortProps.column,
			dir: sortProps.dir || this.sortProps.dir,
		};
	}
}
