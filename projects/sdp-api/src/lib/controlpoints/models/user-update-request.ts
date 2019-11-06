/* tslint:disable */
import { RoleDetails } from './role-details';
import { VADetailsIntoES } from './vadetails-into-es';
export interface UserUpdateRequest {
  lastName?: string;
  ccoId?: string;
  emailAddress?: string;
  firstName?: string;
  haAccountId?: string;
  haAccountName?: string;
  isPartner?: boolean;
  customerId?: string;
  roles?: Array<RoleDetails>;
  saAccountId?: string;
  saAccountName?: string;
  updatedBy?: string;
  updatedTime?: string;
  vaDetails?: Array<VADetailsIntoES>;
}
