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
import { UserResolve } from '@utilities';

/**
 * Roles Service (share role options between SelectRoleComponent)
 */
@Injectable({
	providedIn: 'root',
})
export class RolesService {
	private _request: Observable<RoleDetails[]>;
	private customerId: string;
	private saAccountId: string;
	constructor (
		private route: ActivatedRoute,
		private userService: ControlPointUserManagementAPIService,
		private userResolve: UserResolve,
	) {
		this.customerId = _.get(this.route, ['snapshot', 'data', 'user', 'info', 'customerId']);
		this.userResolve.getSaId()
		.subscribe(saId => this.saAccountId = saId.toString());

	}

	/**
	 * Gets cached roles if present
	 */
	get roles () {
		if (this._request) {
			return this._request;
		}

		this._request = this.userService.getListRolesForGivenUserUsingGET(
			this.saAccountId,
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
