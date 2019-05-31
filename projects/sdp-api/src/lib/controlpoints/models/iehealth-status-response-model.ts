/* tslint:disable */
import { ComponentDetails } from './component-details';
import { SystemDetails } from './system-details';
export interface IEHealthStatusResponseModel {
  component_details?: Array<ComponentDetails>;
  connectivityStatus?: string;
  customerId?: string;
  ieStatus?: string;
  ie_version?: string;
  lastUploadDate?: string;
  remote_id?: string;
  system_details?: SystemDetails;
}
