/* tslint:disable */
export interface Issue {

  /**
   * issueId
   */
  issueId?: string;

  /**
   * deviceId
   */
  deviceId?: string;

  /**
   * problemId
   */
  problemId?: string;

  /**
   * externalIssueId
   */
  externalIssueId?: string;

  /**
   * state
   */
  state?: string;

  /**
   * ignored
   */
  ignored?: string;

  /**
   * ignoreReason
   */
  ignoreReason?: string;

  /**
   * ignoredBy
   */
  ignoredBy?: string;

  /**
   * ignoreTimestamp
   */
  ignoreTimestamp?: string;

  /**
   * lastAlertId
   */
  lastAlertId?: string;

  /**
   * issueOccurences
   */
  issueOccurences?: string;

  /**
   * appliedRemediations
   */
  appliedRemediations?: string;
}
