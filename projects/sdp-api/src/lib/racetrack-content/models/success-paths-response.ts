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
  items?: Array<SuccessPath>;
}
