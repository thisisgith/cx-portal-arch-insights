/* tslint:disable */
export interface GroupTrainingRequestSchema {

  /**
   * Applicable Contract
   */
  contract?: string;

  /**
   * Pitstop
   */
  pitstop?: string;

  /**
   * Language Preference
   */
  preferredLanguage?: string;

  /**
   * Preferred Time for Working Sessions
   */
  preferredSlot?: string;

  /**
   * Solution
   */
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

  /**
   * Usecase
   */
  usecase?: string;
}
