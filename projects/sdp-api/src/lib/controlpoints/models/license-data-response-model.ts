/* tslint:disable */
import { LicenseData } from './license-data';
export interface LicenseDataResponseModel {
  errors?: Array<string>;
  license?: Array<LicenseData>;
  message?: string;
  status?: number;
}
