/* tslint:disable */
import { SecurityAdvisoryBulletinInfo } from './security-advisory-bulletin-info';

/**
 * The security advisory response with a list of advisories
 */
export interface SecurityAdvisoryBulletinResponseObject {
  data: Array<SecurityAdvisoryBulletinInfo>;
}
