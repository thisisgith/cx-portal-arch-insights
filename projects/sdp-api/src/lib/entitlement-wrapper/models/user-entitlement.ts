/* tslint:disable */
import { Company } from './company';
import { Role } from './role';
import { User } from './user';
export interface UserEntitlement {
  companyList?: Array<Company>;
  env?: string;
  internalAssignableRoleList?: Array<Role>;
  internalRoleList?: Array<Role>;
  locale?: string;
  user?: User;
}
