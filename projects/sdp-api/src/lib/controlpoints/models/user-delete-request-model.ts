/* tslint:disable */
import { CSWRole } from './cswrole';
export interface UserDeleteRequestModel {
  ccoId?: string;
  haCompanyId?: string;
  isPartner?: boolean;
  roles?: Array<CSWRole>;
  saCompanyId?: string;
}