/* tslint:disable */
import { RiskAsset } from './risk-asset';
import { RiskPagination } from './risk-pagination';

/**
 * The hardware in the inventory
 */
export interface RiskAssets {
  customerId?: string;
  data: Array<RiskAsset>;
  Pagination?: RiskPagination;
}
