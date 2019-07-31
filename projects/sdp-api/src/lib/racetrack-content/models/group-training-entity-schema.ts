/* tslint:disable */
export interface GroupTrainingEntitySchema {
  ccoId?: string;

  /**
   * Applicable Contract
   */
  contract?: string;

  /**
   * Created Timestamp Epoch
   */
  created?: number;
  customerId?: string;
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
   * Request Status
   */
  status?: string;

  /**
   * Technology Area
   */
  technologyArea?: string;

  /**
   * Time Zone
   */
  timezone?: string;

  /**
   * Unique Identifier for Training Request
   */
  trainingRequestId?: string;

  /**
   * Goal for this training session
   */
  trainingSessionGoal?: string;

  /**
   * Updated Timestamp Epoch
   */
  updated?: number;
  usecase?: string;
}