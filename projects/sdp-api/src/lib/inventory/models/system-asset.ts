/* tslint:disable */
import { SolutionInfo } from './solution-info';
import { Tag } from './tag';
export interface SystemAsset {
  productId?: string;

  /**
   * Device name
   */
  deviceName?: string;
  collectorId?: string;
  wfId?: string;

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

  /**
   * IP Address
   */
  ipAddress?: string;
  productType?: string;
  productName?: string;
  productFamily?: string;
  hasSecurityAdvisories?: boolean;
  hasBugs?: boolean;
  scanStatus?: string;
  isManagedNE?: boolean;
  solutionInfo?: Array<SolutionInfo>;
  tags?: Array<Tag>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
