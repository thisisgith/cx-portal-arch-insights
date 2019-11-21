/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface HardwareAsset {
  hasFieldNotices?: string;
  deviceName?: string;
  collectorId?: string;
  wfId?: string;
  criticalAdvisories?: string;
  serialNumber?: string;
  productId?: string;
  productType?: string;
  productName?: string;
  ipAddress?: string;
  equipmentType?: string;
  neId?: string;
  hwInstanceId?: string;
  supportCovered?: boolean;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
