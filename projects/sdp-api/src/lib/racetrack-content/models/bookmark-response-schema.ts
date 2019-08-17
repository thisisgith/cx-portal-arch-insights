/* tslint:disable */
export interface BookmarkResponseSchema {

  /**
   * is Favorite
   */
  bookmark?: boolean;

  /**
   * Unique Identifier for bookmark request
   */
  bookmarkRequestId?: string;
  ccoId?: string;

  /**
   * Created Timestamp Epoch
   */
  created?: number;
  customerId?: string;

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
   * Updated Timestamp Epoch
   */
  updated?: number;

  /**
   * usecase
   */
  usecase?: string;
}
