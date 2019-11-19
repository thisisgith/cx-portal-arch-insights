/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface HardwareAsset {
  productName?: string;
  deviceName?: string;
  collectorId?: string;
  wfId?: string;
  criticalAdvisories?: string;
  serialNumber?: string;
  productId?: string;
  productType?: string;
  ipAddress?: string;
  hasFieldNotices?: string;
  equipmentType?: string;
  neId?: string;
  hwInstanceId?: string;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
