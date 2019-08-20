/* tslint:disable */
import { SoftwareProfile } from './software-profile';
import { OsvPagination } from './pagination';

export type SoftwareProfilesResponse = {
	data: Array<SoftwareProfile>;
	pagination: OsvPagination;
};
