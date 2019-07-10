/* tslint:disable */
import { DeviceInfo } from './device-info';
export interface RemoveDevicesResponseModel {
  customerId?: string;
  deviceInfo?: Array<DeviceInfo>;
  requestId?: string;
  response?: string;
}
