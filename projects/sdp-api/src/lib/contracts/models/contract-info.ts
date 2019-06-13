/* tslint:disable */
export interface ContractInfo {

  /**
   * First address line of the bill-to site
   */
  billtoAddressLine1?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId: string;

  /**
   * The status of a contract. Example:- Active, Signed, QA Hold , Overdue, Terminated, Service, Entered, Expired & Inactive
   */
  contractStatus: string;

  /**
   * he date when the service contract starts. GMT date format YYYY-MM-DD
   */
  contractStartDate: string;

  /**
   * The date when the service contract ends. GMT date format YYYY-MM-DD
   */
  contractEndDate: string;

  /**
   * A program designed to support Cisco customers or partners. Example:- SNTC, PSS
   */
  serviceProgram: string;

  /**
   * The three or four alphanumeric code that denotes the support service purchased. Example:- NSOP; PSSE; NC2P
   */
  serviceLevel: string;

  /**
   * Unique identifier of a site where the contract was billed to. Example:- 30411234
   */
  billtoSiteId?: string;

  /**
   * Name of a site where the contract was billed to
   */
  billtoSiteName?: string;

  /**
   * The number of the service contract. Example:- 2689444; 91488861, 92246411
   */
  contractNumber: number;

  /**
   * Second address line of the bill-to site
   */
  billtoAddressLine2?: string;

  /**
   * Third address line of the bill-to site
   */
  billtoAddressLine3?: string;

  /**
   * Fourth address line of the bill-to site
   */
  billtoAddressLine4?: string;

  /**
   * City name of the bill-to site
   */
  billtoCity?: string;

  /**
   * State name of the bill-to site
   */
  billtoState?: string;

  /**
   * Postal code of the bill-to site
   */
  billtoPostalCode?: string;

  /**
   * Province name of the bill-to site
   */
  billtoProvince?: string;

  /**
   * Country name of the bill-to site
   */
  billtoCountry?: string;

  /**
   * Name of a company where the contract was billed to
   */
  billtoGuName?: string;
}
