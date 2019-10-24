import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { RolesService } from './roles.service';
import { RoleDetails } from '@sdp-api';
import { Observable } from 'rxjs';

/**
 * SelectRoleComponent
 */
@Component({
	selector: 'select-role',
	styleUrls: ['./select-role.component.scss'],
	templateUrl: './select-role.component.html',
})
export class SelectRoleComponent {
	@Input() public role: RoleDetails;
	public expanded = false;
	public options$: Observable<RoleDetails[]> = this.roles.roles;

	constructor (
		private elem: ElementRef,
		private roles: RolesService,
	) { }

	/**
	 * Hides the dropdown when user clicks off of it
	 * @param event - MouseEvent
	 */
	@HostListener('document:click', ['$event'])
	public clickout (event: MouseEvent) {
		if (!this.elem.nativeElement.contains(event.target)) {
			this.expanded = false;
		}
	}

	/**
	 * Shows/hides the dropdown
	 */
	public toggleExpanded () {
		this.expanded = !this.expanded;
	}
}
