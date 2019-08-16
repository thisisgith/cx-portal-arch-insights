/* tslint:disable */
import { Issue } from './issue';
import { Remediation } from './remediation';
export interface Alert {

  /**
   * alertId
   */
  alertId?: string;

  /**
   * resultId
   */
  resultId?: string;

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
   * name
   */
  name?: string;

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
