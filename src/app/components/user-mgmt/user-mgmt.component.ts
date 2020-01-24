import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnDestroy,
	Output,
	OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { empty, Observable, Subject, forkJoin } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import {
	ControlPointUserManagementAPIService,
	UserDetails,
	UserResponse,
	UserUpdateResponseModel,
	VADetailsResponseModel,
	RoleDetails,
	VADetails,
} from '@sdp-api';
import { SortableColumn, SortProps } from './user-mgmt.types';
import { I18nPipe } from '@cisco-ngx/cui-pipes';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { AddUserComponent } from '../add-user/add-user.component';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * UserMgmtComponent
 */
@Component({
	selector: 'user-mgmt',
	styleUrls: ['./user-mgmt.component.scss'],
	templateUrl: './user-mgmt.component.html',
})
export class UserMgmtComponent implements OnInit, AfterViewInit, OnDestroy {
	@Output() private onUpdate = new EventEmitter<void>();
	@Output() public onSelect: EventEmitter<Observable<UserUpdateResponseModel>> =
		new EventEmitter<Observable<UserUpdateResponseModel>>();
	public alert: any = { };
	public userDetails: UserDetails;
	public virtualAccountName = '';
	private destroyed$: Subject<void> = new Subject<void>();
	private updateUsers$: Subject<UserDetails[]> = new Subject<UserDetails[]>();
	public response: VADetailsResponseModel;
	public saVaRoles: RoleDetails[];
	public isLoading: boolean;
	public numUsers = 0;
	public numUsersWithRoles = 0;
	private user: UserResponse['data'];
	private customerId: string;
	private saAccountId: string;
	public vaAccountId: string;
	public allUsers: UserDetails[];
	public items: VADetails[];
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
		private userReslove: UserResolve,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		this.userReslove.getSaId()
			.subscribe(saId => this.saAccountId = saId.toString());
	}
	public ngOnInit () {
		this.alert.visible = false;
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		// this.vaAccountId = _.get(this.userDetails.roles , ['value_1'], null);
		// this.vaAccountId = 105660;
		// tslint:disable-next-line:no-console
		this.userReslove.getSaId()
			.subscribe(saId => {
				this.saAccountId = saId.toString();
				this.getVirtualAccounts();
				// this.updateUsers$
				// 	.pipe(
				// 		switchMap(() => this.getUsers()),
				// 		map(response => {
				// 			this.allUsers = response.data;

				// 			return this.allUsers;
				// 		}),
				// 		tap(users => this.numUsers = users.length),
				// 		tap(users => this.numUsersWithRoles = users
				// 			.filter(user => user.roles && user.roles.length > 0).length),
				// 	)
				// 	.subscribe();
				// this.updateUsers$
				// 	.next();
				return forkJoin([
					this.getUsers(),
					this.getVirtualAccounts(),
				])
				.pipe(tap(() => {
					this.reflectVA();
				}))
				.subscribe();
			});

	}

	private getVirtualAccounts () {
		return this.usersService
			.getVAListForGivenSACUsingGET(this.saAccountId)
			.pipe(takeUntil(this.destroyed$),
			map(response => {
				this.items = _.get(response, 'data', []);
			}))
			;
	}

	private reflectVA () {
		this.allUsers.forEach(selUser => {
			if (selUser.isSelected) {
				delete selUser.isSelected;
			}
			this.items.forEach(selItem => {
				if ((Array.isArray(selUser.roles) && selUser.roles.length) && selItem.virtual_account_id === selUser.roles[0].value_1) {
					selUser.selectedVirtualAccount = selItem;
				}
			});
		});
	}
	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		this.update();
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
			this.saAccountId,
		)
			.pipe(
				map(response => {
					this.allUsers = response.data;

					return this.allUsers;
				}),
			tap(users => this.numUsers = users.length),
			tap(users => this.numUsersWithRoles = users
				.filter(user => user.roles && user.roles.length > 0).length),
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
	public async onAddUser () {
		const result = await this.cuiModalService.showComponent(AddUserComponent, { }, 'small');
		if (result) {
			this.update();
			_.invoke(
				this.alert,
				'show',
				`${result} ${this.i18n.transform('_UserAddedSuccessfully_')}`,
				'success',
			);
			this.alert.visible = true;
		}
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
					this.update();
				});
		}
	}
	private update () {
		this.getUsers()
		.subscribe(() => {
			this.reflectVA();
		});
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
			customerId: this.customerId,
			rolesRemoved: user.roles,
			saCompanyId: this.saAccountId,
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
					this.update();
				}),
				catchError(() => {
					this.error.show = true;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				if (response.status === 500) {
					this.error.text = _.get(response.data, ['0', 'errMsg'], response.message);
					this.error.show = true;
				}
				this.getVirtualAccounts()
				.subscribe();
			});
	}

	public getRoleType (user) {
		const role = _.get(user.roles, ['0'], null);
		if (!role) {
			return 'saRole';
		}

		return role.type_1 ? 'vaRole' : 'saRole';
	}

	public onSelection (event: any) {
		const selectedUser = _.find(this.allUsers, user => user.ccoId === event.user.ccoId);
		const getVA = _.get(selectedUser, 'selectedVirtualAccount');

		if (getVA && selectedUser.selectedVirtualAccount.name === event.selectedVirtualAccount.name) {
			return false;
		}
		selectedUser.selectedVirtualAccount = event.selectedVirtualAccount;
		selectedUser.isSelected = true;
		this.allUsers = _.cloneDeep(this.allUsers);
	}
}
