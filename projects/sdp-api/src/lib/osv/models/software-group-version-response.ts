/* tslint:disable */
import { OsvPagination } from './pagination';
import { SoftwareGroupVersion } from './software-group-version';

export type SoftwareGroupVersionsResponse = {
	uiProfileSwVersion: Array<SoftwareGroupVersion>;
	pagination: OsvPagination;
};
