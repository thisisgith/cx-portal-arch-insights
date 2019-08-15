/* tslint:disable */
import { DeviceDetails } from './device-details';
export interface IgnorePolicyUpdateRequestModel {
  customerId?: string;
  devices?: Array<DeviceDetails>;
  policyId?: string;
}
