import { Injectable } from '@angular/core';
import { ControlPointUserManagementAPIService, RoleDetails } from '@sdp-api';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * Roles Service (share role options between SelectRoleComponent)
 */
@Injectable({
	providedIn: 'root',
})
export class RolesService {
	private _request: Observable<RoleDetails[]>;
	constructor (
		private userService: ControlPointUserManagementAPIService,
	) { }

	/**
	 * Gets cached roles if present
	 */
	get roles () {
		if (this._request) {
			return this._request;
		}

		this._request = this.userService.getListRolesForGivenUserUsingGET('106200')
			.pipe(
				map(response => [...response.saRoles, ...response.vaRoles]),
				shareReplay(1),
			);

		return this._request;
	}
}
