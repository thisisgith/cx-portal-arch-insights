/* tslint:disable */

/**
 * cdc search result item
 */
export interface CDC {
  filetype?: string;
  score?: number;
  cdcdescription?: string;
  collapseuri?: string;
  contenttype?: string;

  /**
   * Date string in ISO 8601 format
   */
  date?: string;
  displaytitle?: string;
  filesize?: number;
  accesslevel?: string;
  impressionid?: string;
  iocontentsource?: string;
  lllisting?: string;
  size?: number;
  teaser?: string;
  text?: string;
  title?: string;
  uri?: string;
}
