/* tslint:disable */
import { SecurityAdvisoryInfo } from './security-advisory-info';
import { Pagination } from './pagination';
export interface SecurityAdvisoriesResponse {
  data: Array<SecurityAdvisoryInfo>;
  Pagination?: Pagination;
}
