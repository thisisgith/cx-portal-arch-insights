/* tslint:disable */
import { SuccessPath } from './success-path';
export interface SuccessPathsResponse {

  /**
   * ibn
   */
  solution?: string;

  /**
   * usecase name (assurance | sd-access | automation)
   */
  usecase?: string;

  /**
   * pitsop name (onboard | implement | use | engage)
   */
  pitstop?: string;

  /**
   * the total number of items in this solution + use
   */
  totalCount?: number;
  items?: Array<SuccessPath>;
}
