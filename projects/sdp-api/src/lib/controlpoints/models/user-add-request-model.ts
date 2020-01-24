/* tslint:disable */
import { RoleDetails } from "./role-details";
export interface UserAddRequestModel {
    customerId?: string;
    saAccountId?: string;
    ccoId?: string;
    email?: string;
    rolesAdded?: Array<RoleDetails>;     
	isPartner?: string;

}
