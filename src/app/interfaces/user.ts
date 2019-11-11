import { EntitledUser, ServiceInfo, UserEntitlement } from '@sdp-api';

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

/**
 * Interface representing our User
 */
export interface User {
	info: UserEntitlement & EntitledUser;
	service: ServiceInfo;
}
