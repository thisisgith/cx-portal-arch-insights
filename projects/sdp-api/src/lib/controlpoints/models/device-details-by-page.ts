/* tslint:disable */
import { DeviceDetails } from './device-details';
import { Pagination } from './pagination';
export interface DeviceDetailsByPage {
  data?: Array<DeviceDetails>;
  pagination?: Pagination;
}
