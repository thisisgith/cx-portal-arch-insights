/* tslint:disable */
export interface FeedbackSchema {

  /**
   * Flag to indicate the feedback is provided or not for ATX
   */
  available?: boolean;

  /**
   * the feedback id
   */
  feedbackId?: string;

  /**
   * Feedback for ATX
   */
  thumbs?: 'UP' | 'DOWN';
}
