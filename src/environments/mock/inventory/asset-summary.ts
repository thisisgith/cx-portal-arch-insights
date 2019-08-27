import { AssetSummary } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/summary';

/** Default Customer ID */
const customerId = '2431199';

/** Default Hardware Instance ID */
const hwInstanceId = 'FOC1544Y16T,WS-C2960S-24PS-L,NA,FOC1544Y16T,WS-C2960S-24PS-L,NA,NA';

/** Mock data for Network Elements API Results */
/* tslint:disable */
export const MockAssetSummaryData: AssetSummary = {
	"customerId": "2431199",
	"managedNeId": "NA,FOC1544Y16T,WS-C2960S-24PS-L,NA",
	"hwInstanceId": "FOC1544Y16T,WS-C2960S-24PS-L,NA,FOC1544Y16T,WS-C2960S-24PS-L,NA,NA",
	"productFamily": "Cisco Catalyst 2960-S Series Switches",
	"productId": "WS-C2960S-24PS-L",
	"swVersion": "12.2(55)SE3",
	"swType": "IOS",
	"contractNumber": "93425688",
	"coverageEndDate": "2020-11-30T00:00:00",
	"slaCode": null,
	"slaDescription": "SMARTnet 8x5xNBD",
	"warrantyType": "WARR-ELTD-LIFE-HW",
	"warrantyEndDate": "2024-11-30T00:00:00",
	"installAddress1": "C/PASEO DE LOS LOCUTORES ",
	"installAddress2": "",
	"installCity": "SANTO DOMINGO",
	"installState": "DISTRITO NACIONAL",
	"installCountry": "",
	"installPostalCode": "00000",
	"installProvince": "",
	"eoSaleDate": "2015-11-06T00:00:00",
	"lastDateOfSupport": "2025-11-30T00:00:00",
};
/* tslint:enable */

/** The scenarios */
export const AssetSummaryScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Asset Summary',
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
					delay: 100,
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
					delay: 100,
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
					delay: 100,
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
					delay: 100,
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
					delay: 100,
					description: 'Not Covered',
					response: {
						body: { data: [] },
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?hwInstanceId=${hwInstanceId}&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
