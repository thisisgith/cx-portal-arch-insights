/* tslint:disable */
import { CSWRoleUpdateResponse } from './cswrole-update-response';
export interface UserUpdateResponseModel {
  errors?: Array<string>;
  message?: string;
  status?: number;
  data?: Array<CSWRoleUpdateResponse>;
}
