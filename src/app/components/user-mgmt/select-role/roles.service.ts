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
	private _requestRoles: Observable<RoleDetails[]>;
	private _requestVARoles: Observable<RoleDetails[]>;
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
	 * @returns SA Roles
	 */
	public roles () {
		if (this._requestRoles) {
			return this._requestRoles;
		}

		this._requestRoles = this.userService.getListRolesForGivenUserUsingGET(
			this.saAccountId,
		)
			.pipe(
				map(response => [...response.saRoles]),
				shareReplay(1),
			);

		return this._requestRoles;
	}

	/**
	 * Gets cached roles if present
	 * @returns VAroles
	 */
	public vaRoles () {
		if (this._requestVARoles) {
			return this._requestVARoles;
		}

		this._requestVARoles = this.userService.getListRolesForGivenUserUsingGET(
			this.saAccountId,
		)
			.pipe(
				map(response => [...response.saVaRoles]),
				shareReplay(1),
			);

		return this._requestVARoles;
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
