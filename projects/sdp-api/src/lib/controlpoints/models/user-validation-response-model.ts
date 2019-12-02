/* tslint:disable */
import { UserCompanyDetails } from './user-company-details';
export interface UserValidationResponseModel {
  errors?: Array<string>;
  accessLevel?: string;
  company?: string;
  companyList?: Array<UserCompanyDetails>;
  email?: string;
  ccoId?: string;
  firstName?: string;
  isPartnerUser?: boolean;
  lastName?: string;
  message?: string;
  status?: number;
}
