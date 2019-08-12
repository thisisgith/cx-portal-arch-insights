/* tslint:disable */
import { AtxSchema } from './atx-schema';
export interface ATXResponseModel {

  /**
   * ibn
   */
  solution?: string;
  usecase?: string;

  /**
   * pitsop name (onboard | implement | use | engage)
   */
  pitstop?: string;
  items?: Array<AtxSchema>;
}
