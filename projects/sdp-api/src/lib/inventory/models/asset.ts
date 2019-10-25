/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface Asset {
  neId?: string;

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
   * If Device is Covered
   */
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

  /**
   * IP Address
   */
  ipAddress?: string;
  hwInstanceId?: string;
  productId?: string;
  productType?: string;
  productName?: string;
  equipmentType?: string;
  reachabilityStatus?: string;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
