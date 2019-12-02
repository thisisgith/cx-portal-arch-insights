/* tslint:disable */
import { SolutionInfo } from './solution-info';
import { Tag } from './tag';
export interface AssetSystemSummary {
  installAddress2?: string;
  customerId?: string;
  collectorId?: string;
  wfId?: string;
  productFamily?: string;
  productId?: string;
  productName?: string;
  productFamilyCount?: number;
  productType?: string;
  osType?: string;
  osVersion?: string;
  installAddress1?: string;
  managedNeId?: string;
  installCity?: string;
  installState?: string;
  installCountry?: string;
  installPostalCode?: string;
  installProvince?: string;
  installSiteName?: string;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
  tags?: Array<Tag>;
}
