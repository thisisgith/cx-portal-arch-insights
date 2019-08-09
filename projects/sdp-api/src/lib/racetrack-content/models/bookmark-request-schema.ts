/* tslint:disable */
export interface BookmarkRequestSchema {

  /**
   * is Favorite
   */
  bookmark?: boolean;

  /**
   * Unique Identifier of the selecected product guide/atx/acc
   */
  id?: string;

  /**
   * Category of the lifecycle
   */
  lifecycleCategory?: 'ATX' | 'ACC' | 'SB';

  /**
   * Pitstop
   */
  pitstop?: string;

  /**
   * solution
   */
  solution?: string;

  /**
   * usecase
   */
  usecase?: string;
}
