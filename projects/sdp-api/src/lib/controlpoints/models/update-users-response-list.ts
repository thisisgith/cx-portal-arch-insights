/* tslint:disable */
import { RolesAdded } from "./roles-added";
import { UserDetailsResponse } from "./user-details-response";
export interface UpdatedUserResponseList {
    status?: number;
    errCode?: string;
    errMsg?: string;
    data?: {
        user?: UserDetailsResponse;
        roles?: Array<RolesAdded>;
    }
}


  