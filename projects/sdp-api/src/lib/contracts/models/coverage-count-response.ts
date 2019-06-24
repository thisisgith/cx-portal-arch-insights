/* tslint:disable */
import { CoverageCountInfo } from './coverage-count-info';

/**
 * The top n product coverage entries
 */
export interface CoverageCountResponse {
  data: Array<CoverageCountInfo>;
}
