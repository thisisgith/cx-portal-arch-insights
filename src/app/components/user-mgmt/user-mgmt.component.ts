import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnDestroy,
	Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { empty, Observable, Subject } from 'rxjs';
import { catchError, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
	ControlPointUserManagementAPIService,
	UserDetails,
	UserResponse,
	UserUpdateResponseModel,
} from '@sdp-api';
import { SortableColumn, SortProps } from './user-mgmt.types';
import { I18nPipe } from '@cisco-ngx/cui-pipes';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { AddUserComponent } from '../add-user/add-user.component';

/**
 * UserMgmtComponent
 */
@Component({
	selector: 'user-mgmt',
	styleUrls: ['./user-mgmt.component.scss'],
	templateUrl: './user-mgmt.component.html',
})
export class UserMgmtComponent implements AfterViewInit, OnDestroy {
	@Output() private onUpdate = new EventEmitter<void>();
	private destroyed$: Subject<void> = new Subject<void>();
	private updateUsers$: Subject<UserDetails[]> = new Subject<UserDetails[]>();
	public isLoading: boolean;
	public numUsers = 0;
	private user: UserResponse['data'];
	private customerId: string;
	public users$: Observable<UserDetails[]> = this.updateUsers$
		.pipe(
			switchMap(() => this.getUsers()),
			map(response => response.data),
			tap(users => this.numUsers = users.length),
		);
	public sortProps: SortProps = {
		column: 'firstName',
		dir: 'asc',
	};
	public filter: string;
	public userDropdownOptions = [
		[{
			label: this.i18n.transform('_RemoveThisUserFromSmartAccount_'),
		}],
	];
	public error = {
		show: false,
		text: this.i18n.transform('_AnErrorOccurred_'),
	};

	constructor (
		private cdr: ChangeDetectorRef,
		private i18n: I18nPipe,
		private route: ActivatedRoute,
		private usersService: ControlPointUserManagementAPIService,
		private cuiModalService: CuiModalService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		this.updateUsers$.next();
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Makes a request to get users
	 * @returns Observable
	 */
	private getUsers () {
		this.isLoading = true;
		this.cdr.detectChanges();

		return this.usersService.getUserDetailsListForGivenSAUsingGET(
			// this.customerId, TODO add this back
			'106200',
		)
			.pipe(
				finalize(() => {
					this.isLoading = false;
					this.cdr.detectChanges();
				}),
				catchError(() => {
					this.error.show = true;

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
	 * Add User Button click handler
	 */
	public onAddUser () {
		this.cuiModalService.showComponent(AddUserComponent, { }, 'small');
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

	/**
	 * Handles clicking the 'more' dropdown option on a user row
	 * @param action any
	 * @param user UserDetails
	 */
	public handleUserDropdownSelection (action: any, user: UserDetails) {
		if (action.label === this.i18n.transform('_RemoveThisUserFromSmartAccount_')) {
			this.deleteUser(user)
				.pipe(
					catchError(() => {
						this.error.show = true;

						return empty();
					}),
					takeUntil(this.destroyed$),
				)
				.subscribe(() => {
					this.updateUsers$.next();
				});
		}
	}

	/**
	 * Makes API call to delete a user
	 * @param user UserDetails
	 * @returns observable
	 */
	private deleteUser (user: UserDetails) {
		return this.usersService.deleteUserUsingDELETE({
			ccoId: user.ccoId,
			isPartner: false,
			roles: user.roles,
			saCompanyId: this.customerId,
		});
	}

	/**
	 * Handles changing a user's role
	 * @param obs - Observable<UserUpdateResponseModel>
	 */
	public changeRole (obs: Observable<UserUpdateResponseModel>) {
		this.isLoading = true;
		obs
			.pipe(
				finalize(() => {
					this.updateUsers$.next();
				}),
				catchError(() => {
					this.error.show = true;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe();
	}
}
