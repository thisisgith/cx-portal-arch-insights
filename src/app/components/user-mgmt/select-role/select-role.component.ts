import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from './roles.service';
import { RoleDetails, UserDetails, UserUpdateResponseModel, ControlPointUserManagementAPIService } from '@sdp-api';
import { Observable } from 'rxjs';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { UserResolve } from '@utilities';
import { map } from 'rxjs/operators';
import { VIRTUAL_ACCOUNT } from '@constants';

/**
 * SelectRoleComponent
 */
@Component({
	selector: 'select-role',
	styleUrls: ['./select-role.component.scss'],
	templateUrl: './select-role.component.html',
})
export class SelectRoleComponent implements OnInit {
	@Input() public user: UserDetails;
	@Input() public roleType: string;
	@Output() public onSelect: EventEmitter<Observable<UserUpdateResponseModel>> =
		new EventEmitter<Observable<UserUpdateResponseModel>>();
	private customerId: string;
	public role: RoleDetails;
	public roles: RoleDetails[];
	public allRoles: RoleDetails[];
	public expanded = false;
	public roleName: string;
	public roleDescription: string;
	// public options$: Observable<RoleDetails[]> = this.rolesService.roles;
	public saAccountId: number;

	constructor (
		private elem: ElementRef,
		private rolesService: RolesService,
		private route: ActivatedRoute,
		private userService: ControlPointUserManagementAPIService,
		private userReslove: UserResolve,
	) {
		this.customerId = _.get(this.route, ['snapshot', 'data', 'user', 'info', 'customerId']);
		this.userReslove.getSaId()
			.subscribe(saId => this.saAccountId = saId);
	}

	/**
	 * Hides the dropdown when user clicks off of it
	 * @param event - MouseEvent
	 */
	@HostListener('document:click', ['$event'])
	public clickout (event?: MouseEvent) {
		if (!event || !this.elem.nativeElement.contains(event.target)) {
			this.expanded = false;
		}
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		if (_.get(this.user, 'isSelected')) {
			this.roleName = 'Select';
			this.roleDescription = null;
		} else {
			this.roleName = _.get(this.user.roles, ['0', 'roleDisplayName'], I18n.get('_AssignRole_'));
			this.roleDescription = _.get(this.user.roles, ['0', 'roleDescription'], '');
		}
		this.role = _.get(this.user.roles, ['0'], null);
		this.fetchRoles();
	}

	private fetchRoles () {
		const service = this.roleType === 'saRole' ? 'roles' : 'vaRoles';

		return _.invoke(this.rolesService, service, { })
			.pipe(
				map((response: RoleDetails[]) => {
					this.roles = response;
				}),
			)
			.subscribe();
	}

	private filterRoles () {
		this.roles = _.filter(this.allRoles, role => {
			if (_.get(this.user, ['selectedVirtualAccount'])) {
				return role.type === 'vaRole';
			}

			return role.type === 'saRole';

		});
	}

	/**
	 * Shows/hides the dropdown
	 */
	public toggleExpanded () {
		this.expanded = !this.expanded;
	}

	/**
	 * Handles clicking a role option
	 * @param role - RoleDetails
	 */
	public handleClick (role: RoleDetails) {
		if (role.roleDisplayName && role.roleDisplayName === this.roleName) {
			return;
		}
		if (this.roleType === 'vaRole') {
			role.type_1 =  VIRTUAL_ACCOUNT;
			role.value_1 =  _.get(this.user, ['selectedVirtualAccount', 'virtual_account_id']);
		}
		let updateRequest;
		if (this.role) {
			this.role.tenant = 'SMARTACC';
			role.tenant = 'SMARTACC';
			const userUpdate = {
				...this.user,
				customerId: this.customerId,
				isPartner: false,
				rolesAdded: [role],
				rolesRemoved: [this.role],
				saAccountId: this.saAccountId.toString(),
			};
			updateRequest = this.rolesService.updateRole(userUpdate);
		} else {
			const userUpdate = {
				customerId: this.customerId,
				saAccountId: this.saAccountId.toString(),
				ccoId: this.user.ccoId,
				email: this.user.emailAddress,
				rolesAdded: [role],
				isPartner: 'false',
			};
			updateRequest = this.userService.AddNewUserUsingPOST(userUpdate);
		}
		this.clickout();
		this.onSelect.emit(updateRequest);
	}
}
