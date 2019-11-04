/* tslint:disable */
import { VADetails } from './vadetails';
export interface VADetailsResponseModel {
  data?: Array<VADetails>;
  errCode?: string;
  errMsg?: string;
  errors?: Array<string>;
  message?: string;
  status?: number;
  totalRows?: number;
}
