/* tslint:disable */
import { CoverageExpirationInfo } from './coverage-expiration-info';

/**
 * The top n product coverage entries
 */
export interface CoverageExpirationResponse {
  data: Array<CoverageExpirationInfo>;
}
