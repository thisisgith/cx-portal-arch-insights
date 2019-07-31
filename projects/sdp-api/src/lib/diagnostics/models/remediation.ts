/* tslint:disable */
export interface Remediation {

  /**
   * remediationId
   */
  remediationId?: string;

  /**
   * alertId
   */
  alertId?: string;

  /**
   * title
   */
  title?: string;

  /**
   * remediationType
   */
  remediationType?: string;

  /**
   * remediationMethod
   */
  remediationMethod?: string;

  /**
   * payload
   */
  payload?: string;

  /**
   * rollbackPayload
   */
  rollbackPayload?: string;

  /**
   * description
   */
  description?: string;

  /**
   * bdbRemediationId
   */
  bdbRemediationId?: string;
}
