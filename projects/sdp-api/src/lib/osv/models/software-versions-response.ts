/* tslint:disable */
import { SoftwareVersion } from './software-version';
import { Pagination } from './pagination';

export type SoftwareVersionsResponse = {
	data: Array<SoftwareVersion>;
	pagination: Pagination;
};

