/* tslint:disable */
import { RoleDetails } from './role-details';
export interface RoleDetailsResponseModel {
  companyAccountId?: string;
  saRoles?: Array<RoleDetails>;
  saVaRoles?: Array<RoleDetails>;
}
