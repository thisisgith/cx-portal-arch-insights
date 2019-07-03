/* tslint:disable */
import { SecurityAdvisoryBulletin } from './security-advisory-bulletin';

/**
 * The security advisory response with a list of advisories
 */
export interface SecurityAdvisoryBulletinResponse {
  data: Array<SecurityAdvisoryBulletin>;
}
