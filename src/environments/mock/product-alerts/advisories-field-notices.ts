import {
	ProductAlertsPagination as Pagination,
	FieldNoticeAdvisoryResponse,
	FieldNoticeAdvisory,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/advisories-field-notices';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
export const MockFieldNoticeAdvisories: FieldNoticeAdvisory[] = [
	/* tslint:disable */
	{
		"id": 64196,
		"title": "FN64196 - The internal power supply in some Catalyst 3560C and 2960C compact switches may fail - Replace on Failure",
		"assetsImpacted": 1,
		"assetsPotentiallyImpacted": 5,
		"publishedOn": "2016-11-11T00:00:00",
		"lastUpdated": "2018-12-07T00:00:00",
		"version": 1.2,
		"url": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01061&pyShowFullPortal=false"
	},
	{
		"id": 64197,
		"title": "FN64197 - WAAS Devices That Run 6.1.1, 6.1.1a, or 6.2.1 Might Have Connections Reset  - Software Upgrade Recommended",
		"assetsImpacted": 1,
		"assetsPotentiallyImpacted": 1,
		"publishedOn": "2016-09-01T00:00:00",
		"lastUpdated": "2017-10-20T00:00:00",
		"version": null,
		"url": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64197.html"
	},
	{
		"id": 62402,
		"title": "FN# 62402 CRS: CRS16 NEBs compliant Line Card Chassis (LCC) is now available. RMA old CRS16 chassis to obtain new chassis",
		"assetsImpacted": 2,
		"assetsPotentiallyImpacted": 1,
		"publishedOn": "2019-07-18T00:28:21",
		"lastUpdated": "2007-08-15T15:58:20",
		"version": null,
		"url": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62402.html"
	},
	/* tslint:enable */
];

/**
 * Mocks the field notice response
 * @param rows the rows to return
 * @param page the page to return
 * @param copy the number of times to duplicate the data (for testing multiple pages)
 * @returns mock response
 */
function MockData (
	rows?: number,
	page?: number,
	copy?: number,
	): FieldNoticeAdvisoryResponse {
	let data = _.cloneDeep(MockFieldNoticeAdvisories);
	if (copy > 0) {
		for (let i = 0; i < copy; i += 1) {
			data = _.concat(data, ...data);
		}
	}
	const total = data.length;
	let pagination: Pagination;

	if (rows && page) {
		data = data.slice((rows * (page - 1)), (rows * page));
		pagination = {
			page,
			rows,
			total,
			pages: Math.ceil(total / rows),
		};
	}

	return {
		data,
		Pagination: pagination,
	};
}

/** The scenarios */
export const FieldNoticeAdvisoryScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Field Notice Advisories',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 250,
					description: 'Field Notice Advisories - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 250,
					description: 'Field Notice Advisories - Page 1',
					response: {
						body: MockData(10, 1, 3),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=id:ASC&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Field Notice Advisories - Page 2',
					response: {
						body: MockData(10, 2, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=id:ASC&rows=10&page=2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Field Notice Advisories - Page 3',
					response: {
						body: MockData(10, 3, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=id:ASC&rows=10&page=3`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Field Notice Advisories for FOC1544Y16T',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Field Notice Advisories for FOC1544Y16T - Unreachable',
					response: {
						body: { data: [] },
						status: 503,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=lastUpdated:DESC&rows=10&page=1` +
			'&hwInstanceId=FOC1544Y16T,WS-C2960S-24PS-L,NA,FOC1544Y16T,WS-C2960S-24PS-L,NA,NA',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Field Notice Advisories - Count',
					response: {
						body: MockData(1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&page=1`,
		usecases: ['Use Case 1'],
	},
];
