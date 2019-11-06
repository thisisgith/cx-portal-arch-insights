import { EntitledUser, ServiceInfo } from '@sdp-api';

export enum AccessLevel {
	ANONYMOUS = 0,
	GUEST,
	CUSTOMER,
	PARTNER,
	EMPLOYEE,
}

interface Role {
	roleName: string;
	roleDisplayName: string;
	tenant: string;
	tenantDisplayName: string;
	attribType?: string;
	attribValue?: string;
	attribName?: string;
}

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
	info: EntitledUser;
	service: ServiceInfo;
}
