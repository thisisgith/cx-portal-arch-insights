/* tslint:disable */
import { AtxCompleted } from './atx-completed';

/**
 * ATX-Completed index structure
 */
export interface ATXCompletedIndexModel {

  /**
   * domain
   */
  domain?: string;

  /**
   * ATX-Completed search result structure
   */
  search?: Array<AtxCompleted>;
}
