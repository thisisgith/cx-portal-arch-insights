/* tslint:disable */

/**
 * cdc search result item
 */
export interface CDC {
  fields: {
    filetype?: Array<string>;
    score?: Array<number>;
    cdcdescription?: Array<string>;
    collapseuri?: Array<string>;
    contenttype?: Array<string>;

    /**
     * Date String[] in ISO 8601 format
     */
    date?: Array<string>;
    displaytitle?: Array<string>;
    filesize?: Array<number>;
    accesslevel?: Array<string>;
    impressionid?: Array<string>;
    iocontentsource?: Array<string>;
    lllisting?: Array<string>;
    size?: Array<number>;
    teaser?: Array<string>;
    text?: Array<string>;
    title?: Array<string>;
    uri?: Array<string>;
  }
}
