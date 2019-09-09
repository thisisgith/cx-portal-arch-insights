/* tslint:disable */
import { OsvPagination } from './pagination';
import { SoftwareGroupAsset } from './software-group-asset';

export type SoftwareGroupAssetsResponse = {
	uiAssetList: Array<SoftwareGroupAsset>;
	pagination: OsvPagination;
};
