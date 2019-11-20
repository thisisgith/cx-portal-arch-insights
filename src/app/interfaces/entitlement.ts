
export interface RoleListsAndLevel {
	whitelistRoles?: string[] | string;
	blacklistRoles?: string[] | string;
	cxLevel?: number;
}

export interface CheckRoleLevelParams {
	whitelistRoles?: string[] | string;
	blacklistRoles?: string[] | string;
	cxLevel?: number;
	userRole?: string;
	userLevel?: number | string;
}

export interface CheckRoleLevelReturn {
	isAuthorized: boolean;
	role: string;
}

export interface EntitlementApiCalls {
	getUser: Function;
}

export interface CheckListTypeReturn {
	specified: boolean;
	type?: string;
}
