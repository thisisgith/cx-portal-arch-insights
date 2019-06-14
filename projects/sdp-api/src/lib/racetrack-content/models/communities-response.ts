/* tslint:disable */
import { Community } from './community';
export interface CommunitiesResponse {

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
  items?: Array<Community>;
}
