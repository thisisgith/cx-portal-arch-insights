/* tslint:disable */
import { Tags } from './tags';
export interface PolicyGroups {
	policyName?: string;
	devices?: Array<string>;
	tags?: Array<Tags>;
	toBeScanned?: boolean;
}
