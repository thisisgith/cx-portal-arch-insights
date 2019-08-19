/* tslint:disable */
export interface RiskAsset {

  /**
   * OS Version
   */
  osVersion?: string;

  /**
   * IP Address
   */
  deviceName?: string;

  /**
   * When the serial number was last scanned
   */
  lastScan?: string;

  /**
   * Critical advisories
   */
  criticalAdvisories?: number;
  supportCovered?: boolean;

  /**
   * Serial Number
   */
  serialNumber?: string;

  /**
   * OS Type
   */
  osType?: string;

  /**
   * IP Address
   */
  ipAddress?: string;

  /**
   * Role
   */
  role?: string;

  /**
   * Contract Number
   */
  contractNumber?: string;
  managedNeId?: string;
  hwInstanceId?: string;
  containingHwId?: string;
  productId?: string;
  equipmentType?: string;
  crashCount?: number;
}
