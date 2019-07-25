/* tslint:disable */
import { DeviceDetails } from './device-details';
export interface DevicePolicyRequestModel {
  customerId?: string;
  devices?: Array<DeviceDetails>;
  schedule?: string;
}
