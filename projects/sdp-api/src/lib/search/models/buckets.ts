/* tslint:disable */

/**
 * Category Item
 */
export interface Buckets {

  /**
   * the count of search results in this category
   */
  count?: number;

  /**
   * the filter condition to be sent back to search API when user chooses to select this option
   */
  filter?: string;

  /**
   * label of the category item
   */
  label?: string;
}
