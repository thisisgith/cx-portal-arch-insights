/* tslint:disable */
import { Issue } from './issue';
import { Remediation } from './remediation';
export interface Alert {

  /**
   * name
   */
  name?: string;

  /**
   * alertId
   */
  alertId?: string;

  /**
   * issueId
   */
  issueId?: string;

  /**
   * bdbIssueId
   */
  bdbIssueId?: string;

  /**
   * externalTitle
   */
  externalTitle?: string;

  /**
   * externalText
   */
  externalText?: string;

  /**
   * resultId
   */
  resultId?: string;

  /**
   * severity
   */
  severity?: string;

  /**
   * problemId
   */
  problemId?: string;

  /**
   * originalIssueState
   */
  originalIssueState?: string;
  snippet?: Array<string>;
  issue?: Issue;
  remediations?: Array<Remediation>;
}
