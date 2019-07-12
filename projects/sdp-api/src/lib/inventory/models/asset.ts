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
  hwInstanceId?: string;
  containingHwId?: string;
  productId?: string;
  equipmentType?: string;

  /**
   * Critical advisories
   */
  criticalAdvisories?: number;
}
