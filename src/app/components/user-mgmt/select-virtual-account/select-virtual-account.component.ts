import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from '@angular/core';
import { RoleDetails, UserDetails } from '@sdp-api';

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
	 * @param virutalAccount - RoleDetails
	 */
	public handleClick (virutalAccount: any) {
		this.clickout();
		this.onSelect.emit({ selectedVirtualAccount: virutalAccount, user: this.user });
	}
}
