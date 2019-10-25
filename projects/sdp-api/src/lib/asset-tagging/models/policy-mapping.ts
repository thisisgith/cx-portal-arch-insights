/* tslint:disable */
import { Tags } from './tags';
export interface PolicyMapping {
	tags?: Array<Tags>;
	policy?: string;
	toBeScanned?: boolean;
}
