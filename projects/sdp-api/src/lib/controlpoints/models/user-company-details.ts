/* tslint:disable */
import { RoleDetails } from './role-details';
import { UserRoleDetails } from './user-role-details';
export interface UserCompanyDetails {
  accountType?: string;
  assignableRoles?: Array<RoleDetails>;
  companyId?: string;
  companyName?: string;
  domainIdentifier?: string;
  roleList?: Array<UserRoleDetails>;
}
