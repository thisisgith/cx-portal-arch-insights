/* tslint:disable */
import { ELearning } from './elearning';
export interface ELearningResponse {

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
  items?: Array<ELearning>;
}
