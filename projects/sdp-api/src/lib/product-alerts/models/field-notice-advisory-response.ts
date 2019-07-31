/* tslint:disable */
import { FieldNoticeAdvisory } from './field-notice-advisory';
import { Pagination } from './pagination';
export interface FieldNoticeAdvisoryResponse {
  data: Array<FieldNoticeAdvisory>;
  Pagination?: Pagination;
}
