/* tslint:disable */
import { ImpactedAsset } from './impacted-asset';
import { Pagination } from './pagination';
export interface BugImpactedAssetsResponse {
  data: Array<ImpactedAsset>;
  Pagination?: Pagination;
}
