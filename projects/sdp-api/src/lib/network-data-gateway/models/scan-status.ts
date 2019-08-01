/* tslint:disable */

/**
 * This object is used to convey the status of a scan request. It includes attributes defined in the path to facilitate transition to Kafka in the near future
 */
export interface ScanStatus {

  /**
   * The customer's partyId
   */
  partyId?: string;

  /**
   * The unique identifier for the scan request
   */
  transactionId?: string;

  /**
   * The status of the scan [in-progress, success, failure]. When scanStatus = failure the failureReason must be populated
   */
  scanStatus?: string;
  failureReason?: {failureCode?: string, failureDescr?: string};
}
