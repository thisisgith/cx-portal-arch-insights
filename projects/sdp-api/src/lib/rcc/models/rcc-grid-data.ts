/* tslint:disable */
export interface RccGridDataSample1{
    status:number,
    message:string,
    data:RccGridDataSample[],
}

export interface RccGridDataSample{
    impAssets:number,
    policyCat:string,
    policyGroup:string,
    policyName:string,
    ruleName:string,
    severity:string,
    violationCount:number,
}

export interface RccGridData{
    summary: RccGridDataSample1[];
}

export interface RccAssetGridData{
    status:string,
    message:string,
    pagination:number,
    data:RccAssetGridDataSample[],
}

export interface RccAssetGridDataSample{
    percentage:number,
    assetList:RccAssetDataList[],
    totalViolatedDevices:number,
    totalDeviceCount:number,
    }

export interface RccAssetDataList{
    deviceName:string,
    ipaddress:string,
    criticalAdvisories:string,
    supportCovered:boolean,
    serialNumber:string,
    lastScan:string,
    osType:string,
    osVersion:string,
    role:string,
    contractNumber:string,
    managedNeId:string,
    hwInstanceId:string,
    containingHwId:string,
    equipmentType:string,
    productId:string,
    violationCount:number,
    severity:string

}