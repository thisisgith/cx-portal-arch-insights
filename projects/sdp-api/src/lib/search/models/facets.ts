/* tslint:disable */
import { Buckets } from './buckets';

/**
 * Filter Categories
 */
export interface Facets {

  /**
   * list of the category items
   */
  buckets?: Array<Buckets>;

  /**
   * Label of the category
   */
  label?: string;
}
