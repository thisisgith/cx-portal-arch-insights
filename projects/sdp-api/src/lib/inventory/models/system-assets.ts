/* tslint:disable */
import { SystemAsset } from './system-asset';
import { Pagination } from './pagination';

/**
 * The system assets in the inventory
 */
export interface SystemAssets {
  data: Array<SystemAsset>;
  Pagination?: Pagination;
}
