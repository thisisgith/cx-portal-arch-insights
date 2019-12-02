/* tslint:disable */
import { RoleDetails } from './role-details';
import { VADetailsForSAUser } from './vadetails-for-sauser';
export interface UserUpdateRequest {
  lastName?: string;
  ccoId?: string;
  emailAddress?: string;
  firstName?: string;
  haAccountId?: string;
  haAccountName?: string;
  isPartner?: boolean;
  customerId?: string;
  rolesAdded?: Array<RoleDetails>;
  rolesRemoved?: Array<RoleDetails>;
  saAccountId?: string;
  saAccountName?: string;
  updatedBy?: string;
  updatedTime?: string;
  vaDetails?: Array<VADetailsForSAUser>;
}
