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
	"contractNumber": "UNKNOWN",
	"coverageEndDate": null,
	"slaCode": null,
	"slaDescription": null,
	"warrantyType": "WARR-ELTD-LIFE-HW",
	"warrantyEndDate": "2020-11-30T00:00:00",
	"installAddress1": "C/PASEO DE LOS LOCUTORES ",
	"installAddress2": "",
	"installCity": "SANTO DOMINGO",
	"installState": "DISTRITO NACIONAL",
	"installCountry": "",
	"installPostalCode": "00000",
	"installProvince": "",
	"eoSaleDate": "2015-11-06T00:00:00",
	"lastDateOfSupport": "2020-11-30T00:00:00",
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
			],
		},
		url: `${api}?hwInstanceId=${hwInstanceId}&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
