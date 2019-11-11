/* tslint:disable */
import { SADetails } from './sadetails';
export interface SAUserResponseModel {
  data?: Array<SADetails>;
  errCode?: string;
  errMsg?: string;
  errors?: Array<string>;
  message?: string;
  status?: number;
  totalRows?: number;
}
