/* tslint:disable */
import { AtxFuture } from './atx-future';

/**
 * ATX-Future index structure
 */
export interface ATXFutureIndexModel {

  /**
   * domain
   */
  domain?: string;

  /**
   * ATX-Future search result structure
   */
  search?: Array<AtxFuture>;
}
