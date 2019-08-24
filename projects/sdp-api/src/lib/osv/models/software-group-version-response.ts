/* tslint:disable */
import { OsvPagination } from './pagination';
import { SoftwareGroupVersion } from './software-group-version';

export type SoftwareGroupVersionsResponse = {
	uiSwVersionList: Array<SoftwareGroupVersion>;
	pagination: OsvPagination;
};
