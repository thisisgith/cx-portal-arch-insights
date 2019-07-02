/* tslint:disable */
export interface ACCBookmarkSchema {

  /**
   * Boolean value to indicate if the acc is marked favorite
   */
  isFavorite?: boolean;

  /**
   * Unique identifier of a Cisco customer.
   */
  customerId?: string;

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
}
