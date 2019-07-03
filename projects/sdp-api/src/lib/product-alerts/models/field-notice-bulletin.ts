/* tslint:disable */
export interface FieldNoticeBulletin {

  /**
   * The Cisco.com bulletin number for Field Notices
   */
  fieldNoticeId?: number;

  /**
   * Status
   */
  status?: string;

  /**
   * The date when the bulletin was last revised and published to Cisco.com. GMT date format YYYY-MM-DD
   */
  bulletinLastUpdated?: string;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinTitle?: string;

  /**
   * The date when the bulletin was first published to Cisco.com. GMT date format YYYY-MM-DD
   */
  bulletinFirstPublished?: string;

  /**
   * Distribution Code
   */
  distributionCode?: string;

  /**
   * The Cisco.com URL for the bulletin
   */
  URL?: string;

  /**
   * Category of field notices
   */
  fieldNoticeType?: string;
}
