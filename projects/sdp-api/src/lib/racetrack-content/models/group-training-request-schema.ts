/* tslint:disable */
export interface GroupTrainingRequestSchema {

  /**
   * Applicable Contract
   */
  contract?: string;
  pitstop?: string;

  /**
   * Language Preference
   */
  preferredLanguage?: string;

  /**
   * Preferred Time for Working Sessions
   */
  preferredSlot?: string;
  solution?: string;

  /**
   * Technology Area
   */
  technologyArea?: string;

  /**
   * Time Zone
   */
  timezone?: string;

  /**
   * Goal for this training session
   */
  trainingSessionGoal?: string;
  usecase?: string;
}
