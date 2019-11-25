/* tslint:disable */
import { OrgUserTeamAccount } from './org-user-team-account';
import { OrgUserSubscribedServiceLevels } from './org-user-subscribed-service-levels';
import { OrgUserDataCenterInfo } from './org-user-data-center-info';
export interface OrgUserResponse {

  /**
   * The name of the organization. Not available for LA, use information from account API
   */
  orgName?: string;

  /**
   * This is the party identifier used throughout the system
   */
  customerId?: string;

  /**
   * The CX BUId to which the user with the admin role is affilated. The value set for the admin role is propagated to other users so it can be looked up when any user logs in. The CXBUId is used to retrieve the lifecycle data from CSDF
   */
  cxBUId?: string;
  individualAccount?: {ccoId?: string, saId?: string, vaId?: string, role?: string, userMethods?: Array<string>, cxBUId?: string};
  account?: OrgUserTeamAccount;
  subscribedServiceLevel?: OrgUserSubscribedServiceLevels;
  dataCenter?: OrgUserDataCenterInfo;
}
