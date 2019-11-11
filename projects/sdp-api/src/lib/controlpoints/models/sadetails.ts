/* tslint:disable */
import { RoleDetails } from './role-details';
import { UserDetails } from './user-details';
export interface SADetails {
  roles?: Array<RoleDetails>;
  user?: UserDetails;
}
