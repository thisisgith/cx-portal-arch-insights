/* tslint:disable */
import { SoftwareGroup } from './software-group';
import { OsvPagination } from './pagination';

export type SoftwareGroupsResponse = {
	uiProfileList: Array<SoftwareGroup>;
	pagination: OsvPagination;
};
