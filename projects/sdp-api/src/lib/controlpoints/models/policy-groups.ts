/* tslint:disable */
import {TagDetails} from './admin-complience';
export interface PolicyGroups {
    policyName:string;
    devices:[];
    toBeScanned: boolean;
    tags:Array<TagDetails>;
}