/* tslint:disable */
import { UserCompanyDetails } from './user-company-details';
export interface HADetailsResponseModel {
  accessLevel?: string;
  companyList?: Array<UserCompanyDetails>;
  errors?: Array<string>;
  message?: string;
  status?: number;
  userId?: string;
}
