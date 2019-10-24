/* tslint:disable */
export interface UserFeedbackEntitySchema {

  /**
   * Feedback comment
   */
  comment?: string;
  context?: {entityId?: string, assetType?: 'ATX' | 'ACC', partnerId?: string, customerId?: string};

  /**
   * Epoch feedback creation timestamp
   */
  created?: number;

  /**
   * Feedback Id
   */
  feedbackId?: string;

  /**
   * The program for which this feedback was given
   */
  program?: string;
  rating?: number;
  thumbs?: 'UP' | 'DOWN';

  /**
   * Epoch feedback updated timestamp
   */
  updated?: number;
  userId?: string;
}
