/* tslint:disable */
import { PartnerViewDetails } from './partner-view-details';
export interface PartnerViewDetailsResponseModel {
  errors?: Array<string>;
  message?: string;
  saAccountId?: string;
  status?: number;
  viewMasterList?: Array<PartnerViewDetails>;
}
