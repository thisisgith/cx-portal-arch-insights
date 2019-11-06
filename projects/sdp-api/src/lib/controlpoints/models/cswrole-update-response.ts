/* tslint:disable */
import { SADetails } from './sadetails';
export interface CSWRoleUpdateResponse {
  data?: SADetails;
  errCode?: string;
  errMsg?: string;
  errors?: Array<string>;
  message?: string;
  status?: number;
}
