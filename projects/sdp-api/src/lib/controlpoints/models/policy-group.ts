/* tslint:disable */
import {TagDetails} from './admin-complience';
export interface PolicyGroup {
    policyName:string;
    devices:[];
    toBeScanned: boolean;
    tags:Array<TagDetails>;
}