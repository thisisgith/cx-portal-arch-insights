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
   * content to display
   */
  items?: Array<SuccessPath>;

  /**
   * the total number of items in this solution + usecase
   */
  totalCount?: number;
}
