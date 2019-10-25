/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface SystemAsset {
  productId?: string;

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
  managedNeId?: string;
  neId?: string;
  hwInstanceId?: string;

  /**
   * IP Address
   */
  ipAddress?: string;
  productType?: string;
  productName?: string;
  hasSecurityAdvisories?: boolean;
  hasBugs?: boolean;
  scanStatus?: string;
  isManagedNE?: boolean;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
