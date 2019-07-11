/* tslint:disable */
import { SoftwareEOLBulletin } from './software-eolbulletin';
import { Pagination } from './pagination';
export interface SofwareEOLBulletinResponse {
  data: Array<SoftwareEOLBulletin>;
  Pagination?: Pagination;
}
