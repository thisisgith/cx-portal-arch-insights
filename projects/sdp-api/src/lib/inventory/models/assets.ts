/* tslint:disable */
import { Asset } from './asset';
import { Pagination } from './pagination';

/**
 * The hardware in the inventory
 */
export interface Assets {
  data: Array<Asset>;
  Pagination?: Pagination;
}
