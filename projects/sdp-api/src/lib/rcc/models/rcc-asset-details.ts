/* tslint:disable */

export interface RccAssetDetails{
    status:string,
    message:string,
    data:RccAssetDetailsSample,
    error:string,
    // pagination:number,
}
export interface RccAssetDetailsSample{
    hostName:string,
    violation: RccAssetViolationDetails[]

}
export interface RccAssetViolationDetails{
    policyGroupPolicyRuleId: string,
    policyName: string,
    policyGroup: string,
    policyDesc: string,
    ruleName: string,
    ruleDesc: string,
    ruleSeverity: string,
    conditionList: RccAssetConditionList[]
    violationAge: string,
    violationCount: number
}

export interface RccAssetConditionList{
	severity: string,
    message: string,
    suggestedFix: string,
    age: number,
    conditionCount: number,
}
export interface RccAssetDetailsReqData{
    deviceId:string,
    //hostName:string,
    ipAddress:string,
    serialNumber:string,
    customerId:string,
    lastScan:string,
    pageNum:number,
    pageLimit:number,
    violationCount:number,
    sortBy:string,
}

export interface RccAssetFilterResponse{

    status:string,
    message:string,
    data:RccAssetFilterDetailsResponse[],
   }
export interface RccAssetFilterDetailsResponse{
    severity: any,
    hostName: string,
    policyGroupName: any,
    customerId: string,
    policyName: any
}
export interface RccAssetSelectReq{
    customerId: string,
    serialNumber:string,
    pageIndex:number,
    pageSize:number,
    sortBy:string,
    sortOrder:string,
    policyName:string,
    policyGroupName:string,
    severity:string,
}
export interface RccAssetFilterReq{
    customerId: string,
    serialNumber:string,
}