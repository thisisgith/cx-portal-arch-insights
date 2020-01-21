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
import { RoleDetails, UserDetails, UserUpdateResponseModel, ControlPointUserManagementAPIService } from '@sdp-api';
import { Observable } from 'rxjs';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { UserResolve } from '@utilities';

/**
 * SelectRoleComponent
 */
@Component({
	selector: 'select-virtual-account',
	styleUrls: ['./select-virtual-account.component.scss'],
	templateUrl: './select-virtual-account.component.html',
})
export class SelectVirtualAccountComponent {
	@Input() public virtualAccounts: [];
	@Input() public user: UserDetails;
	@Output() public onSelect: EventEmitter<any> =
		new EventEmitter<any>();
	public role: RoleDetails;
	public expanded = false;
	public roleName: string;
	public roleDescription: string;

	constructor (
		private elem: ElementRef,
	) {
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
	 * Shows/hides the dropdown
	 */
	public toggleExpanded () {
		this.expanded = !this.expanded;
	}

	/**
	 * Handles clicking a role option
	 * @param role - RoleDetails
	 */
	public handleClick (virutalAccount: any) {
		this.clickout();
		this.onSelect.emit({ selectedVirtualAccount: virutalAccount, user: this.user });
	}
}
