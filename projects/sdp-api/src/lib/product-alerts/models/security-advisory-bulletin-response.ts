/* tslint:disable */
import { SecurityAdvisoryBulletin } from './security-advisory-bulletin';
import { Pagination } from './pagination';

/**
 * The security advisory response with a list of advisories
 */
export interface SecurityAdvisoryBulletinResponse {
  data: Array<SecurityAdvisoryBulletin>;
  Pagination?: Pagination;
}
