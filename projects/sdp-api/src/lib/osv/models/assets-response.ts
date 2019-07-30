/* tslint:disable */
import { OSVAsset } from './asset';
import { Pagination } from './pagination';

export type AssetsResponse = {
	uiAssetList: Array<OSVAsset>;
	pagination: Pagination;
};
