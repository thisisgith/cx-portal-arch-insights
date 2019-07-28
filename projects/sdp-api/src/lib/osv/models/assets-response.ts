/* tslint:disable */
import { OSVAsset } from './asset';
import { Pagination } from './pagination';

export type AssetsResponse = {
	data: Array<OSVAsset>;
	pagination: Pagination;
};
