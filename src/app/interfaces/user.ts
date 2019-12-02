import { EntitledUser, UserEntitlement, OrgUserTeamAccount } from '@sdp-api';

// TODO: Move to /constants when available
export enum AccessLevel {
	ANONYMOUS = 0,
	GUEST,
	CUSTOMER,
	PARTNER,
	EMPLOYEE,
}

/**
 * Interface representing the User Role
 */
interface Role {
	roleName: string;
	roleDisplayName: string;
	tenant: string;
	tenantDisplayName: string;
	attribType?: string;
	attribValue?: string;
	attribName?: string;
}

/**
 * Interface representing the User's Smart Account
 */
export interface SmartAccount {
	companyName: string;
	companyId: number;
	domainIdentifier: string;
	accountType: 'CUSTOMER' | 'HOLDING' | 'VIRTUAL' | 'PARTNER';
	roleList: Role[];
}

// TODO: Remove when backward-compatible user mapping is removed
export interface MappedUser {
	name: string;
	customerId: string;
	individual: {
		name: string;
		familyName: string;
		emailAddress: string;
		ccoId: string;
		cxBUId: string;
		role: string;
	};
	account: OrgUserTeamAccount;
	subscribedSolutions: {
		cxLevel: string;
	};
}

/**
 * Interface representing our User
 */
export interface User {
	info: UserEntitlement & EntitledUser & MappedUser;
	service: {
		serviceLineName?: string;
		cxLevel?: string;
	};
}
