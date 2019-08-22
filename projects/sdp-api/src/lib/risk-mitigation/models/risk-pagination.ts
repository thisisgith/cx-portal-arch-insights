/* tslint:disable */

/**
 * The pagination results for the query
 */
export interface RiskPagination {

  /**
   * The current page
   */
  page?: number;

  /**
   * The total number of pages
   */
  pages?: number;

  /**
   * The total number of rows in the response
   */
  rows?: number;

  /**
   * The total number of rows
   */
  total?: number;
}
