/* tslint:disable */
import { SoftwareVersion } from './software-version';
import { OsvPagination } from './pagination';

export type SoftwareVersionsResponse = {
	uiSwVersionList: Array<SoftwareVersion>;
	pagination: OsvPagination;
};

