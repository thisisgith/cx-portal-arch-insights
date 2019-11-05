/* tslint:disable */
export interface HardwareEOLCountResponse {
  "gt-0-lt-12-months"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
  "gt-12-lt-24-months"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
  "gt-24-lt-36-months"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
  "gt-36-months"?: {numericValue?: number, fromTimestampInMillis?: number};
}
