/* tslint:disable */
import { CriticalBug } from './critical-bug';
import { Pagination } from './pagination';
export interface CriticalBugsResponse {
  data: Array<CriticalBug>;
  Pagination?: Pagination;
}
