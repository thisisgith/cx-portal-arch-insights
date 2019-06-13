/* tslint:disable */
import { ACC } from './acc';
export interface ACCResponse {

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
  items?: Array<ACC>;
}
