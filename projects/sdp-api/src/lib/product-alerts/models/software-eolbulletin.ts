/* tslint:disable */
export interface SoftwareEOLBulletin {

  /**
   * The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
   */
  lastShipDate?: string;

  /**
   * The unique identifier for software end-of-life entry in a data store
   */
  swEolInstanceId?: number;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinTitle?: string;

  /**
   * Uniform resource locator. The Cisco.com URL for the bulletin
   */
  URL?: string;

  /**
   * Published Date
   */
  publishedDate?: string;

  /**
   * End of Life External Announcement Date. GMT date format YYYY-MM-DD
   */
  eoLifeExternalAnnouncementDate?: string;

  /**
   * End of Life Internal Announcement Date. GMT date format YYYY-MM-DD
   */
  eoLifeInternalAnnouncementDate?: string;

  /**
   * The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
   */
  eoSaleDate?: string;

  /**
   * End of Engineering Date. GMT date format YYYY-MM-DD
   */
  eoEngineeringDate?: string;

  /**
   * End of Life Date. GMT date format YYYY-MM-DD
   */
  eoLifeDate?: string;

  /**
   * The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
   */
  lastDateOfSupport?: string;

  /**
   * The Cisco.com bulletin number for an End-of-Life bulletin and Field Notices
   */
  bulletinNumber?: string;

  /**
   * For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
   */
  eoNewServiceAttachmentDate?: string;

  /**
   * The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
   */
  eoRoutineFailureAnalysisDate?: string;

  /**
   * The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
   */
  eoSwMaintenanceReleasesDate?: string;

  /**
   * End of Bu Engineering Support Tac Date
   */
  eoBuEngineeringSupportTacDate?: string;

  /**
   * The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
   */
  eoServiceContractRenewalDate?: string;

  /**
   * End of Signature Releases Date
   */
  eoSignatureReleasesDate?: string;

  /**
   * End of Software Availability Date
   */
  eoSoftwareAvailabilityDate?: string;

  /**
   * End of Software License Availability Date
   */
  eoSoftwareLicenseAvailabilityDate?: string;

  /**
   * The last date that Cisco Engineering may release a planned maintenance release or scheduled software remedy for a security vulnerability issue. GMT date format YYYY-MM-DD
   */
  eoVulnerabilitySecuritySupport?: string;
  milestoneInfo?: Array<{currentHwEolMilestone?: string, nextHwEolMilestone?: string, currentHwEolMilestoneDate?: string, nextHwEolMilestoneDate?: string}>;
}
