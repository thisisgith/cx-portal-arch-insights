/* tslint:disable */
import { DeviceDetails } from './device-details';
export interface DevicePolicyResponseModel {
  customerId?: string;
  devices?: Array<DeviceDetails>;
  policyId?: string;
  policyName?: string;
  schedule?: string;
}
