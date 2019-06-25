/* tslint:disable */
import { NetworkElement } from './network-element';
import { Pagination } from './pagination';

/**
 * The NEs in the inventory
 */
export interface NetworkElementResponse {
  data: Array<NetworkElement>;
  Pagination?: Pagination;
}
