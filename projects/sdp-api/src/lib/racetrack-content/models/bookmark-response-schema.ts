/* tslint:disable */
export interface BookmarkResponseSchema {

  /**
   * Unique Identifier of the selecected product guide/atx/acc
   */
  id?: string;

  /**
   * is Favorite
   */
  bookmark?: boolean;
  ccoId?: string;

  /**
   * Created Timestamp Epoch
   */
  created?: number;
  customerId?: string;

  /**
   * Unique Identifier for bookmark request
   */
  bookmarkRequestId?: string;

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
   * Updated Timestamp Epoch
   */
  updated?: number;

  /**
   * usecase
   */
  usecase?: string;
}
