/* tslint:disable */
export interface UserTraining {

  /**
   * City where training was conducted
   */
  city?: string;

  /**
   * The contract number against which this training was conducted
   */
  contract_number?: string;

  /**
   * Country where training was conducted
   */
  country?: string;

  /**
   * Customer Name
   */
  customer?: string;

  /**
   * Training duration (days)
   */
  duration?: number;

  /**
   * End Date
   */
  end_date?: string;

  /**
   * Comma separated instructor names
   */
  instructors?: string;

  /**
   * Start Date
   */
  start_date?: string;

  /**
   * Training Title
   */
  title?: string;

  /**
   * Training Type
   */
  training_type?: string;
}
