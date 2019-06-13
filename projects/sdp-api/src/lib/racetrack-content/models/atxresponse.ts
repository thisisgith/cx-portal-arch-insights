/* tslint:disable */
import { ATX } from './atx';
export interface ATXResponse {

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
  items?: Array<ATX>;
}
