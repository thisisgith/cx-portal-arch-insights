/* tslint:disable */
import { CDCSearchResponse } from './cdcsearch-response';
import { CommunitySearchResponse } from './community-search-response';

/**
 * CDC Global Search Top level API Response
 */
export interface GlobalSearchResponse {

  /**
   * cdc search response
   */
  cdcSearch?: CDCSearchResponse;

  /**
   * community search response
   */
  communitySearch?: CommunitySearchResponse;
}
