/* tslint:disable */
export interface CoverageInfo {

  /**
   * First address line of the installed-at site
   */
  installAddress1?: string;

  /**
   * The unique, generated ID of the managed network element
   */
  managedNeId: string;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId: string;

  /**
   * A serial number is a unique number used for identification. Example:- FTX1512AHK2; FDO1541Z067; SAD07370169
   */
  serialNumber?: string;

  /**
   * The alphanumeric identifier used by customers to order Cisco products. Example:- CISCO2921/K9; WS-C3750X-24S-S; WS-X6748-GE-TX
   */
  productId?: string;

  /**
   * customerName
   */
  customerName?: string;

  /**
   * instanceId
   */
  instanceId?: number;

  /**
   * The number of the service contract. Example:- 2689444; 91488861, 92246411
   */
  contractNumber?: number;

  /**
   * The status of a contract. Example:- Active, Signed, QA Hold , Overdue, Terminated, Service, Entered, Expired & Inactive
   */
  contractStatus?: string;

  /**
   * The date when the service contract starts. GMT date format; YYYY-MM-DD
   */
  contractStartDate?: string;

  /**
   * The date when the service contract ends. GMT date format YYYY-MM-DD
   */
  contractEndDate?: string;

  /**
   * The contract coverage status of a piece of hardware. Example:- Active, Signed, QA Hold, Overdue
   */
  coverageStatus?: string;

  /**
   * Service Line Status
   */
  serviceLineStatus?: string;

  /**
   * The date when coverage for hardware product on a service contract starts
   */
  coverageStartDate?: string;

  /**
   * The date when coverage for a hardware product on a service contract ends.
   */
  coverageEndDate?: string;

  /**
   * The types of warranty Cisco provides on its hardware
   */
  warrantyType?: string;

  /**
   * The date warranty starts on a piece of purchased hardware. GMT date format YYYY-MM-DD
   */
  warrantyStartDate?: string;

  /**
   * The date warranty expires on a piece of purchased hardware. GMT date format YYYY-MM-DD
   */
  warrantyEndDate?: string;

  /**
   * CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
   */
  neId: string;

  /**
   * Second address line of the installed-at site
   */
  installAddress2?: string;

  /**
   * City name of the installed-at site
   */
  installCity?: string;

  /**
   * State name of the installed-at site
   */
  installState?: string;

  /**
   * Country name of the installed-at site
   */
  installCountry?: string;

  /**
   * Postal code of the installed-at site
   */
  installPostalCode?: string;

  /**
   * Province name of the installed-at site
   */
  installProvince?: string;

  /**
   * Name of a site where the product was shipped to
   */
  installSiteName?: string;

  /**
   * First address line of the bill-to site
   */
  billToAddress1?: string;

  /**
   * Second address line of the bill-to site
   */
  billToAddress2?: string;

  /**
   * City name of the bill-to site
   */
  billToCity?: string;

  /**
   * State name of the bill-to site
   */
  billToState?: string;

  /**
   * Country name of the bill-to site
   */
  billToCountry?: string;

  /**
   * Postal code of the bill-to site
   */
  billToPostalCode?: string;

  /**
   * Province name of the bill-to site
   */
  billToProvince?: string;

  /**
   * A program designed to support Cisco customers or partners. Example:- SNTC, PSS
   */
  serviceProgram?: string;

  /**
   * Indicates the type of service level agreement (SLA) that is noted in the contract. Example:- WARR-90-DAY-LTD-HW, WARR-LTD-LIFE-HW
   */
  slaCode?: string;

  /**
   * sla description
   */
  slaDescription?: string;

  /**
   * Name of a site where the contract was billed to
   */
  billToSiteName?: string;
}
