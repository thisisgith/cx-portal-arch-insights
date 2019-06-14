/* tslint:disable */
import { Community } from './community';
import { Facets } from './facets';

/**
 * Community Search Response
 */
export interface CommunitySearchResponse {

  /**
   * search result documents
   */
  documents?: Array<Community>;

  /**
   * list of filter categories applicable for current results
   */
  facets?: Array<Facets>;

  /**
   * total hits for search
   */
  totalHits?: number;

  /**
   * time taken by cdc api
   */
  totalTime?: number;
}
