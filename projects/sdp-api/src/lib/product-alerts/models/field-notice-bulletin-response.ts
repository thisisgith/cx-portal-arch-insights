/* tslint:disable */
import { FieldNoticeBulletin } from './field-notice-bulletin';
import { Pagination } from './pagination';
export interface FieldNoticeBulletinResponse {
  data: Array<FieldNoticeBulletin>;
  Pagination?: Pagination;
}
