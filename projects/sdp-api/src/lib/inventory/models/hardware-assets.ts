/* tslint:disable */
import { HardwareAsset } from './hardware-asset';
import { Pagination } from './pagination';

/**
 * The hardware assets in the inventory
 */
export interface HardwareAssets {
  data: Array<HardwareAsset>;
  Pagination?: Pagination;
}
