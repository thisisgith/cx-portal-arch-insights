/* tslint:disable */
import { Elearning } from './elearning';

/**
 * Elearning index structure
 */
export interface ElearningIndexModel {

  /**
   * domain
   */
  domain?: string;

  /**
   * Elearning search result structure
   */
  search?: Array<Elearning>;
}
