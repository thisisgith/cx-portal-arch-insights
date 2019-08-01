/* tslint:disable */
export interface SecurityAdvisoryImpactedInfoAndCount {

  /**
   * The psirtId
   */
  psirtId?: string;

  /**
   * The security advisory headline
   */
  headline?: string;

  /**
   * the severity of the security advisory (assigned by Cisco)
   */
  severity?: string;

  /**
   * The date the security advisory was published
   */
  publishedDate?: string;

  /**
   * The date the security advisory was revised
   */
  revisedDate?: string;

  /**
   * The security advisory summary
   */
  summary?: string;

  /**
   * The URL to the security advisory
   */
  advisoryURL?: string;

  /**
   * The number of impacted network elements
   */
  impactedEntityCount?: number;
}
