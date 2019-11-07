/* tslint:disable */
import { UserDetails } from './user-details';
export interface SAUserResponseModel {
  data?: Array<UserDetails>;
  errCode?: string;
  errMsg?: string;
  errors?: Array<string>;
  message?: string;
  status?: number;
  totalRows?: number;
}
