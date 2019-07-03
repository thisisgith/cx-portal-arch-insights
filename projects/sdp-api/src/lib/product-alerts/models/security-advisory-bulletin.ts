/* tslint:disable */
export interface SecurityAdvisoryBulletin {

  /**
   * Announcement Type Name
   */
  announcementTypeName?: string;

  /**
   * Internally generated ID for a security advisory
   */
  securityAdvisoryInstanceId?: number;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinTitle?: string;

  /**
   * The version '#' of the Cisco.com bulletin. Only applicable to Security Advisories
   */
  bulletinVersion?: string;

  /**
   * The Summary of a Cisco.com bulletin
   */
  summaryText?: string;

  /**
   * Detail Text
   */
  detailText?: string;

  /**
   * Code Name
   */
  codeName?: string;

  /**
   * The date when the bulletin was first published to Cisco.com. GMT date format YYYY-MM-DD
   */
  bulletinFirstPublished?: string;

  /**
   * Uniform resource locator. The Cisco.com URL for the bulletin
   */
  URL?: string;

  /**
   * Public Release Indicator
   */
  publicReleaseIndicator?: string;

  /**
   * Mapping State Name
   */
  mappingStateName?: string;

  /**
   * Document Id
   */
  documentId?: number;

  /**
   * Alert Status Code
   */
  alertStatusCode?: string;

  /**
   * Published identifier of security advisory
   */
  advisoryId?: string;

  /**
   * DefectId
   */
  defectId?: string;

  /**
   * Severity
   */
  severity?: string;

  /**
   * Common Vulnerabilities and Exposures (CVE) Identifier
   */
  cveId?: string;

  /**
   * Common Vulnerability Scoring System (CVSS) Base Score
   */
  cvssBaseScore?: string;

  /**
   * Common Vulnerability Scoring System (CVSS) Temporal Score
   */
  cvssTemporalScore?: string;

  /**
   * Affected Image Name
   */
  affectedImageName?: string;

  /**
   * Signature Release Date
   */
  signatureReleaseDate?: string;

  /**
   * Software Voss Date
   */
  softwareVossDate?: string;
}
