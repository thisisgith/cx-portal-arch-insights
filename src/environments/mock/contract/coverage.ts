import { HttpHeaders } from '@angular/common/http';
import { CoverageResponse, CoverageCountsResponse } from '@sdp-api';

import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/contracts/v1/';

/** Default Customer ID */
const customerId = '2431199';
/** Default network ID */
const managedNeId = 'NA,FOC1544Y16T,WS-C2960S-24PS-L,NA';

/** The mock response for coverage counts */
const mockCoverageCounts: CoverageCountsResponse = {
	covered: 8,
	expired: 0,
	uncovered: 93,
	unknown: 0,
};

/** The mock response for coverages */
const coverageResponse: CoverageResponse = {
	data: [
		{
			billToAddress1: '116 INVERNESS DRIVE EAST SUITE 375',
			billToAddress2: 'C/O CASTLE PINES CAPITAL',
			billToCity: 'ENGLEWOOD',
			billToCountry: 'US',
			billToPostalCode: '80112',
			billToProvince: 'CO',
			billToSiteName: 'DIMENSION DATA NORTH AMERICA INC',
			billToState: 'CO',
			contractEndDate: '2019-03-16T00:00:00',
			contractNumber: 93425688,
			contractStartDate: '2013-06-01T00:00:00',
			contractStatus: 'ACTIVE',
			coverageEndDate: '2018-01-31T00:00:00',
			coverageStartDate: '2016-05-23T00:00:00',
			coverageStatus: 'ACTIVE',
			customerName: 'DIMENSION DATA NORTH AMERICA INC',
			hwInstanceId: 'CAT1107NHD6,WS-C3750G-24T-S,NA,CAT1107NHD6,WS-C3750G-24T-S,NA,NA',
			installAddress1: '600 AMPHITHEATRE PKWY',
			installAddress2: '',
			installCity: 'MOUNTAIN VIEW',
			installCountry: 'SANTA CLARA',
			installPostalCode: '94043',
			installProvince: '',
			installSiteName: 'GOOGLE INC',
			installState: 'CA',
			instanceId: 324034426,
			managedNeId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
			neId: 'NA,CAT1107NHD6,WS-C3750G-24T-S,NA',
			productId: 'ASAv',
			serialNumber: 'CAT1107NHD6',
			serviceLineStatus: 'ACTIVE',
			serviceProgram: 'SMARTNET',
			slaCode: 'SNT',
			slaDescription: 'SMARTnet 8x5xNBD',
			warrantyEndDate: '2018-01-31T00:00:00',
			warrantyStartDate: '2007-03-29T00:00:00',
			warrantyType: 'WARR-LTD-LIFE-HW',
		},
	  ],
};

/** The scenarios */
export const CoverageScenarios = [
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Coverage',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': '7',
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}products/coverages?customerId=${customerId}&coverage=covered`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Coverage Counts',
					response: {
						body: mockCoverageCounts,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 100,
					description: 'Coverage - Empty Body',
					response: {
						body: { },
						status: 200,
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Coverage 500 Failure',
					response: {
						status: 500,
						statusText: 'Internal Server Error',
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Coverage < 1%',
					response: {
						body: {
							covered: 8,
							expired: 0,
							uncovered: 3,
							unknown: 8915,
						},
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}coverages/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Coverage',
					response: {
						body: coverageResponse,
						status: 200,
					},
					selected: true,
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
		url: `${api}products/coverages?customerId=${customerId}` +
			`&rows=1&page=1&managedNeId=${managedNeId}`,
		usecases: ['Use Case 1'],
	},
];