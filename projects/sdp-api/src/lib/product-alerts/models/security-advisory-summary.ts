/* tslint:disable */
export interface SecurityAdvisorySummary {

  /**
   * The total number of security advisories
   */
  advisoryCount?: number;
  advisorySummary?: Array<{alertSeverity?: string, alertCount?: number}>;
}
