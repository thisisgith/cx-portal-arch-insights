/* tslint:disable */
import { ACCModel } from './accmodel';
import { ATXCompletedModel } from './atxcompleted-model';
import { ATXFutureModel } from './atxfuture-model';
import { CDCSearchResponse } from './cdcsearch-response';
import { CommunitySearchResponse } from './community-search-response';
import { ElearningModel } from './elearning-model';

/**
 * CDC Global Search Top level API Response
 */
export interface GlobalSearchResponse {

  /**
   * Accelerator search response
   */
  acc?: ACCModel;

  /**
   * ATX-Completed search response
   */
  "atx-completed"?: ATXCompletedModel;

  /**
   * ATX-Future search response
   */
  "atx-future"?: ATXFutureModel;

  /**
   * cdc search response
   */
  cdcSearch?: CDCSearchResponse;

  /**
   * community search response
   */
  communitySearch?: CommunitySearchResponse;

  /**
   * Elearning search response
   */
  elearning?: ElearningModel;
}
