/* tslint:disable */
import { Equipment } from './equipment';
export interface InventoryDeviceEqContract {
  generatedAt?: string;
  Equipment?: Equipment;
  contractNumber?: string;
  contractStatus?: string;
  coverageStatus?: string;
  createdDate?: string;
  genPartyId?: string;
  collectorId?: string;
  managedNeId?: string;
  partyId?: string;
  reachabilityFailureReason?: string;
  reachabilityStatus?: string;
  recordType?: string;
  role?: string;
  wfid?: string;
}
