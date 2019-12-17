import { AssetSummary } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/system/summary';

const hardware_asset_summary_api = '/api/customerportal/inventory/v1/assets/summary';

/** Default Customer ID */
const customerId = '2431199_0';

const neId = 'NA,FHK1045Y01E,WS-C2960-24TC-L,NA';

const hwInstanceId = 'FHK1045Y01E,WS-C2960-24TC-L,NA,FHK1045Y01E,WS-C2960-24TC-L,NA,NA';

/** Mock data for Network Elements API Results */
/* tslint:disable */
export const MockAssetSummaryData: AssetSummary = {
	"customerId": "189433_0",
	"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
	"collectorId": "CSP0001048910",
	"wfId": "100e65fd-7cba-4a0c-8fdf-4e0be6ee5467",
	"productFamily": "Cisco Catalyst 2960 Series Switches",
	"productId": "WS-C2960-24TC-L",
	"productName": "",
	"productFamilyCount": 2,
	"productType": "LAN Switches",
	"osType": null,
	"osVersion": "12.2(50)SE",
	"installAddress1": "601 NW SECOND STREET",
	"installAddress2": "C/O AMERICAN GENERAL FINANCE",
	"installCity": "EVANSVILLE",
	"installState": "IN",
	"installCountry": "VANDERBURGH",
	"installPostalCode": "47708",
	"installProvince": "",
	"installSiteName": "CISCO TAC CUSTOMER",
	"solutionInfo": [
		{
			"useCase": "Campus Software Image Management",
			"solution": "IBN"
		},
		{
			"useCase": "Campus Network Assurance",
			"solution": "IBN"
		},
		{
			"useCase": "Network Device Onboarding",
			"solution": "IBN"
		}
	],
	"cxLevel": "2",
	"saId": 189433,
	"vaId": [
		230368
	],
	"tags": [
		{
			"tagName": "AT-Tag4",
			"tagValue": "e3f07a63-aec4-4ab7-8125-c685f0dc9edc"
		},
		{
			"tagName": "C2900",
			"tagValue": "9fbe56fb-7f92-4b3e-9211-ebb69e7d32ea"
		},
		{
			"tagName": "cp-asset-tagging-test-tag2",
			"tagValue": "5b8968b5-6789-4ebe-a0c3-3510c1ee4339"
		}
	]
};

/* tslint:disable */
export const MockHardwareAssetSummaryData: AssetSummary = {
	"customerId": "189433_0",
	"collectorId": "CSP0001048910",
	"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
	"productFamily": "Cisco Catalyst 2960 Series Switches",
	"productId": "WS-C2960-24TC-L",
	"swType": "IOS",
	"swVersion": "12.2(50)SE",
	"wfId": "100e65fd-7cba-4a0c-8fdf-4e0be6ee5467",
	"cxLevel": "2",
	"vaId": [
	  230368
	],
	"hwInstanceId": "FHK1045Y01E,WS-C2960-24TC-L,NA,FHK1045Y01E,WS-C2960-24TC-L,NA,NA",
	"productName": "^Catalyst 2960 24 10/100 + 2T/SFP LAN Base Image",
	"contractNumber": "93856991",
	"coverageStatus": "Covered",
	"coverageStartDate": "2013-12-02T00:00:00",
	"coverageEndDate": "2017-12-02T00:00:00",
	"slaCode": "PSUT",
	"slaDescription": "PRTNR SUP 8X5XNBD",
	"warrantyType": "WARR-LTD-LIFE-HW",
	"warrantyEndDate": "2019-10-31T00:00:00",
	"installAddress1": "601 NW SECOND STREET",
	"installAddress2": "C/O AMERICAN GENERAL FINANCE",
	"installCity": "EVANSVILLE",
	"installState": "IN",
	"installCountry": "VANDERBURGH",
	"installPostalCode": "47708",
	"installProvince": "",
	"installSiteName": "CISCO TAC CUSTOMER",
	"eoSaleDate": "2014-10-31T00:00:00",
	"lastDateOfSupport": "2019-10-31T00:00:00"
	};
/* tslint:enable */

/** The scenarios */
export const AssetSummaryScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Asset Summary By NeId',
					response: {
						body: MockAssetSummaryData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Asset Summary - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'No keys',
					response: {
						body: {
							data: [
								{
									coverageEndDate: '2019-03-16T00:00:00',
									managedNeId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
									warrantyEndDate: '2018-01-31T00:00:00',
								},
							],
						},
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'No dates',
					response: {
						body: {
							data: [
								{
									contractNumber: 93425688,
									managedNeId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
									warrantyType: 'WARR-LTD-LIFE-HW',
								},
							],
						},
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'Null keys',
					response: {
						body: {
							data: [
								{
									contractNumber: null,
									coverageEndDate: '2019-03-16T00:00:00',
									managedNeId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
									warrantyEndDate: '2018-01-31T00:00:00',
									warrantyType: null,
								},
							],
						},
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'Null dates',
					response: {
						body: {
							data: [
								{
									contractNumber: 93425688,
									coverageEndDate: null,
									managedNeId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
									neId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
									warrantyEndDate: null,
									warrantyType: 'WARR-LTD-LIFE-HW',
								},
							],
						},
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'Not Covered',
					response: {
						body: { data: [] },
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?neId=${neId}&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Asset Summary By Hardware InstanceId',
					response: {
						body: MockHardwareAssetSummaryData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${hardware_asset_summary_api}?hwInstanceId=${hwInstanceId}&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
