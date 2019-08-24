/* tslint:disable */

import {
    TemplateRef,
} from '@angular/core';
export interface RccDataSample1 {
    status: number,
    message: string,
    data: RccDataSample[],
}

export interface RccDataSample {
    impAssets: number,
    policyCat: string,
    policyGroup: string,
    policyName: string,
    ruleName: string,
    severity: string,
    violationCount: number,
}

export interface RccData {
    severityFilters: RccDataSample1[],
    policyFilters: RccDataSample1[],
    assetCount: number,
    policyViolationCount: number;
}
/**
 * Main interface for the RCC track
 */
export interface Filter {
    key: string;
    selected?: boolean;
    template?: TemplateRef<{}>;
    title: string;
    loading: boolean;
    seriesData: {
        filter: string,
        label: string,
        selected: boolean,
        value: number,
    }[];
}

export interface violationGridParams {
    criteria: string,
    customerId: number,
    pageLimit: number,
    pageNum: number,
    policyType: string,
    search: string,
    severity: string,
}

export interface RccPolicyViolationData {
    customerId: number,
    policyCategory: string,
    policyGroup: string,
    policyName: string,
    ruleName: string,
    severity: string,
    violationCount?:number
}

export interface RccCustomer {
    customerId: number 
}

export interface AssetGridDataQueryParam {
    customerId: number,
    pageLimt:number, 
    pageNum:number, 
    policyType:string,
    severity:string,
}
