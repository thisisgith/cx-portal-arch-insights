import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	ControlPointUserManagementAPIService,
	RoleDetails,
	UserUpdateRequest,
} from '@sdp-api';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash-es';

/**
 * Roles Service (share role options between SelectRoleComponent)
 */
@Injectable({
	providedIn: 'root',
})
export class RolesService {
	private _request: Observable<RoleDetails[]>;
	private customerId: string;
	constructor (
		private route: ActivatedRoute,
		private userService: ControlPointUserManagementAPIService,
	) {
		this.customerId = _.get(this.route, ['snapshot', 'data', 'user', 'info', 'customerId']);
	}

	/**
	 * Gets cached roles if present
	 */
	get roles () {
		if (this._request) {
			return this._request;
		}

		this._request = this.userService.getListRolesForGivenUserUsingGET(
			// this.customerId, TODO add this back
			'106200',
		)
			.pipe(
				map(response => [...response.saRoles/*, ...response.vaRoles*/]),
				shareReplay(1),
			);

		return this._request;
	}

	/**
	 * Updates role for a given user
	 * @param user - UserDetails
	 * @returns Observable
	 */
	public updateRole (user: UserUpdateRequest) {
		return this.userService.updateUsersUsingPOST([user]);
	}
}
