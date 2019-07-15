/* tslint:disable */
import { HardwareEOLBulletin } from './hardware-eolbulletin';
import { Pagination } from './pagination';
export interface HardwareEOLBulletinResponse {
  data: Array<HardwareEOLBulletin>;
  Pagination?: Pagination;
}
