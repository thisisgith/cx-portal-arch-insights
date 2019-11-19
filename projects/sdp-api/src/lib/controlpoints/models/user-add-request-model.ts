/* tslint:disable */
import { RolesAdded } from "./roles-added";
export interface UserAddRequestModel {
    customerId?: string;
    saAccountId?: string;
    ccoId?: string;
    email?: string;
    rolesAdded?: Array<RolesAdded>;     
    isPartner?: string;

}
