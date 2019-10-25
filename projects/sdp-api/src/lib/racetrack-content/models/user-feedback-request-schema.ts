/* tslint:disable */
export interface UserFeedbackRequestSchema {

  /**
   * Feedback commewnt
   */
  comment?: string;
  context?: {entityId?: string, assetType?: 'ATX' | 'ACC', partnerId?: string, customerId?: string};
  thumbs?: 'UP' | 'DOWN';
}
