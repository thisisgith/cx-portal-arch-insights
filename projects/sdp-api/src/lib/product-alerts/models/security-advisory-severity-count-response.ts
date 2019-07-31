/* tslint:disable */
export interface SecurityAdvisorySeverityCountResponse {

  /**
   * Count of security advisories in severity Critical
   */
  critical?: number;

  /**
   * Count of security advisories in severity High
   */
  high?: number;

  /**
   * Count of security advisories in severity Medium
   */
  medium?: number;

  /**
   * Count of security advisories in severity Low
   */
  low?: number;

  /**
   * Count of security advisories in severity Info
   */
  info?: number;
}
