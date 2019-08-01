/* tslint:disable */
import { DeviceConnectivityAndEligibility } from './device-connectivity-and-eligibility';
export interface DevicesConnectivityResponseModel {
  customerId?: string;
  deviceConnectivityAndEligibility?: Array<DeviceConnectivityAndEligibility>;
  productId?: string;
  serialNumber?: string;
}
