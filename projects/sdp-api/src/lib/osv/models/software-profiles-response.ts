/* tslint:disable */
import { SoftwareProfile } from './software-profile';
import { Pagination } from './pagination';

export type SoftwareProfilesResponse = {
	data: Array<SoftwareProfile>;
	pagination: Pagination;
};
