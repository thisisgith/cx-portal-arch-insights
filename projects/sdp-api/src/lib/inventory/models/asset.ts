/* tslint:disable */
export interface Asset {

  /**
   * Contract Number
   */
  contractNumber?: string;

  /**
   * Device name
   */
  deviceName?: string;

  /**
   * When the serial number was last scanned
   */
  lastScan?: string;

  /**
   * Critical advisories
   */
  criticalAdvisories?: string;
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
   * OS Version
   */
  osVersion?: string;

  /**
   * Role
   */
  role?: string;

  /**
   * IP Address
   */
  ipAddress?: string;
  managedNeId?: string;
  neId?: string;
  hwInstanceId?: string;
  containingHwId?: string;
  productId?: string;
  productName?: string;
  equipmentType?: string;
  reachabilityStatus?: string;
}
