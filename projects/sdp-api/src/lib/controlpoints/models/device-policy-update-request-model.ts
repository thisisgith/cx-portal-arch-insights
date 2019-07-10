/* tslint:disable */
import { DeviceDetails } from './device-details';
export interface DevicePolicyUpdateRequestModel {
  customerId?: string;
  devices?: Array<DeviceDetails>;
  policyId?: string;
  policyName?: string;
  schedule?: string;
}
