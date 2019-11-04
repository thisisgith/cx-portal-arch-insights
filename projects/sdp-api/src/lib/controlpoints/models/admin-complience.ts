/* tslint:disable */
import{PolicyGroups} from './policy-groups';
export interface RightTagResponse {
    customerId?: string;
    policyGroups?: Array<PolicyGroups>;

  }

export interface TagDetails
{
    tagName:string;
    tagValue:string;
    devices:[];
	  deviceCount:Number;
}