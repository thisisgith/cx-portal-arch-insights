/* tslint:disable */
import { Equipment } from './equipment';
export interface InventoryDeviceEqContract {
  Equipment?: Equipment;
  collectorId?: string;
  contractNumber?: string;
  contractStatus?: string;
  coverageStatus?: string;
  createdDate?: string;
  genPartyId?: string;
  generatedAt?: string;
  managedNeId?: string;
  partyId?: string;
  reachabilityFailureReason?: string;
  reachabilityStatus?: string;
  recordType?: string;
  role?: string;
  wfid?: string;
}
