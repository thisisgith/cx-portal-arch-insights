/* tslint:disable */
import { CDC } from './cdc';
import { Facets } from './facets';

/**
 * cdc api response
 */
export interface CDCSearchResponse {

  /**
   * search result documents
   */
  documents?: Array<CDC>;

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
