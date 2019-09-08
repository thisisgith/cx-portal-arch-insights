/* tslint:disable */
export interface HardwareEOLCountResponse {
  "gt-0-lt-30-days"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
  "gt-30-lt-60-days"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
  "gt-60-lt-90-days"?: {fromTimestampInMillis?: number, numericValue?: number, toTimestampInMillis?: number};
}
