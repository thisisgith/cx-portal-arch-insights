/* tslint:disable */
import { RoleDetails } from './role-details';
export interface UserDetails {
  accessLevel?: string;
  address?: string;
  ccoId?: string;
  companyName?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  roles?: Array<RoleDetails>;
  selectedVirtualAccount?: any;
}
