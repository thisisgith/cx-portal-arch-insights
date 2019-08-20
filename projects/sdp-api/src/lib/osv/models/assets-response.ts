/* tslint:disable */
import { OSVAsset } from './asset';
import { OsvPagination } from './pagination';

export type AssetsResponse = {
	uiAssetList: Array<OSVAsset>;
	pagination: OsvPagination;
};
