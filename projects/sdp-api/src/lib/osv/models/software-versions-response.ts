/* tslint:disable */
import { SoftwareVersion } from './software-version';
import { Pagination } from './pagination';

export type SoftwareVersionsResponse = {
	uiSwVersionList: Array<SoftwareVersion>;
	pagination: Pagination;
};

