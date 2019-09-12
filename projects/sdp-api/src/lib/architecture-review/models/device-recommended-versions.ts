/*  tslint:disable */
export interface IDeviceRecommendedVersions {
  pid ?: string;
  deviceRole ?: string;
  hardware ?: string;
  recommendedSwVersions ? : Array<string>;
  minimumSwVersion ?: string;
}