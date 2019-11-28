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
	@Output() public onSelect: EventEmitter<Observable<UserUpdateResponseModel>> =
		new EventEmitter<Observable<UserUpdateResponseModel>>();
	private customerId: string;
	public role: RoleDetails;
	public expanded = false;
	public roleName: string;
	public roleDescription: string;
	public saAccountId = '104959';
	public options$: Observable<RoleDetails[]> = this.roles.roles;

	constructor (
		private elem: ElementRef,
		private roles: RolesService,
		private route: ActivatedRoute,
		private userService: ControlPointUserManagementAPIService,
	) {
		this.customerId = _.get(this.route, ['snapshot', 'data', 'user', 'info', 'customerId']);
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
		this.roleName = _.get(this.user.roles, ['0', 'roleDisplayName'], I18n.get('_AssignRole_'));
		this.roleDescription = _.get(this.user.roles, ['0', 'roleDescription'], '');
		this.role = _.get(this.user.roles, ['0'], null);
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
				saAccountId: '104959', // TODO update this to be saId
			};
			updateRequest = this.roles.updateRole(userUpdate);
		} else {
			const userUpdate = {
				customerId: this.customerId,
				saAccountId: this.saAccountId,
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
