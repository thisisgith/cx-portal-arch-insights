/* tslint:disable */
import { FieldNotice } from './field-notice';
import { Pagination } from './pagination';
export interface FieldNoticeResponse {
  data: Array<FieldNotice>;
  Pagination?: Pagination;
}
