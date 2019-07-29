/* tslint:disable */
import { DeviceInfo } from './device-info';
import { Pagination } from './pagination';
export interface DeviceDetailsByPage {
  data?: Array<DeviceInfo>;
  pagination?: Pagination;
}
