/* tslint:disable */
import { InventoryDeviceEqContract } from './inventory-device-eq-contract';
export interface Device {
  InventoryDeviceEqContract?: InventoryDeviceEqContract;
  createdDate?: string;
  eligibility?: string;
  lastModified?: string;
  reachabilityFailureReasons?: string;
  reachabilityStatus?: string;
  scanStatus?: string;
}
