/* tslint:disable */
import { SoftwareEOLBulletin } from './software-eolbulletin';
import { Pagination } from './pagination';
export interface SoftwareEOLBulletinResponse {
  data: Array<SoftwareEOLBulletin>;
  Pagination?: Pagination;
}
