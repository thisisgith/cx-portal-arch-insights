/* tslint:disable */
import { SecurityAdvisory } from './security-advisory';
import { Pagination } from './pagination';
export interface SecurityAdvisoryResponse {
  data: Array<SecurityAdvisory>;
  Pagination?: Pagination;
}
