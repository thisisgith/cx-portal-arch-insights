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
import { RoleDetails, UserDetails, UserUpdateResponseModel } from '@sdp-api';
import { Observable } from 'rxjs';
import * as _ from 'lodash-es';

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
	public options$: Observable<RoleDetails[]> = this.roles.roles;

	constructor (
		private elem: ElementRef,
		private roles: RolesService,
		private route: ActivatedRoute,
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
		this.role = this.user.roles[0];
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
		if (role.roleDisplayName === this.role.roleDisplayName) {
			return;
		}
		const updateRequest = this.roles.updateRole({
			...this.user,
			customerId: this.customerId,
			isPartner: false,
			rolesAdded: [role],
			rolesRemoved: [this.role],
			saAccountId: '106200', // TODO update this to be saId
		});
		this.clickout();
		this.onSelect.emit(updateRequest);
	}
}
