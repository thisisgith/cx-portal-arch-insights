/* tslint:disable */
import{PolicyGroup} from './policy-group';
export interface RightTagResponse {
    customerId?: string;
    policyGroups?: Array<PolicyGroup>;

  }

export interface TagDetails
{
    tagName:string;
    tagValue:string;
    devices:[];
	  deviceCount:Number;
}