/* tslint:disable */
import { LastUpdatedCount } from './last-updated-count';
export interface FieldNoticeUpdatedResponse {
  "gt-0-lt-30-days"?: LastUpdatedCount;
  "gt-30-lt-60-days"?: LastUpdatedCount;
  "gt-60-lt-90-days"?: LastUpdatedCount;
  "further-out"?: LastUpdatedCount;
}
