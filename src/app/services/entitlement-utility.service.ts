import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResolve } from '@utilities';
import {
	CheckRoleLevelParams,
	RoleListsAndLevel,
	CheckRoleLevelReturn,
	CheckListTypeReturn,
} from '@interfaces';
import { map } from 'rxjs/operators';

enum entitlementUtilParamConstants {
	ARRAY = 'Array',
	STRING = 'String',
}

/**
 * EntitlementUtilityService provides basic business logic and conditionals
 * to provide to various other role level entitlement based objects
 */
@Injectable({
	providedIn: 'root',
})
export class EntitlementUtilityService {
	private userRole: string;

	constructor (
		private userResolve: UserResolve,
	) { }

	/**
	 * Runs through basic conditionals where either the user role
	 * is included in the `whitelistRoles` which are allowed and the `cxLevel` is equal to or above
	 * the level allowed. Disallows user in `blacklistRoles`. Both roles lists (one or the other) and `cxLevel` are conditional
	 * but one of the two is required or the service will throw an error. `whitelistRoles` and `blackListroles` are exclusive
	 * of each other and cannot be used together.
	 *
	 * @param interface CheckRoleLevelParams
	 * @returns boolean
	 */
	public checkRoleAndLevel ({
		whitelistRoles,
		blacklistRoles,
		cxLevel,
		userRole,
		userLevel,
	}: CheckRoleLevelParams): boolean {
		this.userRole = userRole;

		const {
			specified: hasWhitelistRolesSpecified,
			type: whiteListType,
		} = this.rolesSpecifiedAsStringOrArray(whitelistRoles);

		const {
			specified: hasBlacklistRolesSpecified,
			type: blackListType,
		}  = this.rolesSpecifiedAsStringOrArray(blacklistRoles);

		const levelSpecified = typeof cxLevel === 'number';

		if (!hasWhitelistRolesSpecified && !levelSpecified && !hasBlacklistRolesSpecified) {
			throw new Error(
				// tslint:disable-next-line: ter-max-len
				'Please provide the correct inputs { whitelistRoles?: string[] | string, blacklistRoles?: string[] | string, cxLevel?: number }',
			);
		}

		if (hasWhitelistRolesSpecified && hasBlacklistRolesSpecified) {
			throw new Error(
				// tslint:disable-next-line: ter-max-len
				'`whiteListRole` or `blacklistRoles` may only be used exclusive of each other',
			);
		}

		let isAuthorized = false;

		let hasWhitelistRole = false;
		if (hasWhitelistRolesSpecified) {
			hasWhitelistRole = this.checkWhiteListRoles(whitelistRoles, whiteListType);
		}

		let hasNoBlacklistRole = false;
		if (hasBlacklistRolesSpecified) {
			hasNoBlacklistRole = this.checkBlackListRoles(blacklistRoles, blackListType);
		}

		const hasLevel = userLevel >= (levelSpecified ? cxLevel : 0);

		const hasRole = hasWhitelistRole || hasNoBlacklistRole;
		const roleSpecified = hasWhitelistRolesSpecified || hasBlacklistRolesSpecified;

		const hasBothLevelAndRole = levelSpecified && hasLevel && roleSpecified && hasRole;
		const hasLevelNoRoleSpecified = levelSpecified && hasLevel && !roleSpecified;
		const hasRoleNoLevelSpecified = roleSpecified && hasRole && !levelSpecified;

		isAuthorized = (
			hasBothLevelAndRole
			|| hasLevelNoRoleSpecified
			|| hasRoleNoLevelSpecified
		);

		return isAuthorized;
	}

	/**
	 * Checked to see if user role is in the black listed roles
	 *
	 * @param blacklistRoles array | string to check this.userRole against
	 * @param type type of `blacklistRoles` supplied; either a string or an array
	 *
	 * @returns boolean
	 */
	private checkBlackListRoles (blacklistRoles: string[] | string, type: string): boolean {
		return (type === entitlementUtilParamConstants.ARRAY && !blacklistRoles.includes(this.userRole))
			|| (type === entitlementUtilParamConstants.STRING && blacklistRoles !== this.userRole);
	}

	/**
	 * Checked to see if user role is in the white listed roles
	 *
	 * @param whitelistRoles array | string to check this.userRole against
	 * @param type type of `whitelistRoles` supplied; either a string or an array
	 *
	 * @returns boolean
	 */
	private checkWhiteListRoles (whitelistRoles: string[] | string, type: string): boolean {
		return (type === entitlementUtilParamConstants.ARRAY && whitelistRoles.includes(this.userRole))
			|| (type === entitlementUtilParamConstants.STRING  && whitelistRoles === this.userRole);
	}

	/**
	 * Checks to see if the input of the utility's `blacklistRoles` or `whitelistRoles` is either
	 * an Array or string, and returns a string with type `array` or `string`
	 *
	 * @param roles array | string
	 * @returns CheckListTypeReturn
	 */
	private rolesSpecifiedAsStringOrArray (roles: string[] | string): CheckListTypeReturn {
		const rolesArray = Boolean(Array.isArray(roles) && roles.length);
		const rolesString = Boolean(typeof roles === 'string' && roles.length);

		const specified = rolesArray || rolesString;

		let type;
		if (rolesArray) {
			type = entitlementUtilParamConstants.ARRAY;
		} else if (rolesString) {
			type = entitlementUtilParamConstants.STRING;
		}

		return {
			specified,
			type,
		};
	}

	/**
	 * Calls UserResolve to get the users role and level and then compares that against `whitelistRoles` and
	 * `blacklistRoles` and `cxLevel` supplied to the method to validate against which will then return the
	 * users role and a boolean (through an observable) to say whether the user is authorized
	 *
	 * @param roleLevel: RoleListsAndLevel
	 * @returns Observable that then returns and object CheckRoleLevelReturn
	 */
	public getUserCheckLevelAndRole (roleLevel: RoleListsAndLevel = { }): Observable<CheckRoleLevelReturn> {
		const { whitelistRoles, blacklistRoles, cxLevel } = roleLevel;

		return this.userResolve.getUser()
			.pipe(
				map(getUser => {
					const { info: { individual: { role: userRole = '' } }, service: { cxLevel: userLevel } } = getUser;
					const isAuthorized = this.checkRoleAndLevel({
						cxLevel,
						whitelistRoles,
						blacklistRoles,
						userRole,
						userLevel: userLevel && Number(userLevel),
					});

					return { isAuthorized, role: userRole };
				}),
			);
	}
}
