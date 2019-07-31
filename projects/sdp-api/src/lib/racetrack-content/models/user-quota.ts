/* tslint:disable */
export interface UserQuota {

  /**
   * Available Quota
   */
  closed_ilt_courses_available?: number;

  /**
   * Entitled Quota
   */
  closed_ilt_courses_entitled?: number;

  /**
   * Used Quota
   */
  closed_ilt_courses_used?: number;

  /**
   * Contract Number
   */
  contract_number?: string;

  /**
   * Contract End Date
   */
  end_date?: string;

  /**
   * Contract Start Date
   */
  start_date?: string;
}
