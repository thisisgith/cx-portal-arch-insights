/* tslint:disable */
import { SecurityAdvisoryImpactedInfoAndCount } from './security-advisory-impacted-info-and-count';
import { Pagination } from './pagination';

/**
 * The security advisory response with a list of advisories
 */
export interface SecurityAdvisoryImpactCountResponse {
  data: Array<SecurityAdvisoryImpactedInfoAndCount>;
  Pagination?: Pagination;
}
