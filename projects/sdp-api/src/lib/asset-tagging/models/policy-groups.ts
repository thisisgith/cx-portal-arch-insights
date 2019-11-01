/* tslint:disable */
import { Tags } from './tags';
export interface PolicyGroups {
	policyName?: string;
	devices?: [];
	tags?: Array<Tags>;
	toBeScanned?: boolean;
}
