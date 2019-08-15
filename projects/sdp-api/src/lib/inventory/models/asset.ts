/* tslint:disable */
export interface Asset {

  /**
   * Device name
   */
  deviceName?: string;

  /**
   * IP Address
   */
  ipAddress?: string;

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
   * OS Version
   */
  osVersion?: string;

  /**
   * Role
   */
  role?: string;

  /**
   * Contract Number
   */
  contractNumber?: string;
  managedNeId?: string;
  neId?: string;
  hwInstanceId?: string;
  containingHwId?: string;
  productId?: string;
  equipmentType?: string;
  productName?: string;
  reachabilityStatus?: string;
}
