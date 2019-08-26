import {
	DiagnosticsPagination as Pagination,
	BugImpactedAssetsResponse,
	ImpactedAsset,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** The customerId */
const customerId = '2431199';

/** base API for user info */
const api = '/api/customerportal/diagnostics/v1/critical-bugs/assets';

/** The Mock bugs  */
export const MockBugAssets: ImpactedAsset[] = [
	/* tslint:disable */
	{
		"hostName": "C6770",
		"ipAddress": "10.1.1.1",
		"softwareVersion": "1.4"
	},
	{
		"hostName": "C6708",
		"ipAddress": "10.3.1.4",
		"softwareVersion": "1.3"
	}
	/* tslint:enable */
];

/**
 * Mocks the field notice response
 * @param rows the rows to return
 * @param page the page to return
 * @param state states to filter
 * @param id ids to filter
 * @param copy the number of times to duplicate the data (for testing multiple pages)
 * @returns mock response
 */
function MockData (
	rows?: number,
	page?: number,
): BugImpactedAssetsResponse {
	let data = _.cloneDeep(MockBugAssets);

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

/**
 * The scenarios
 */
export const CriticalBugAssetsScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bug CSCto03123 Assets',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&cdetId=CSCto03123&rows=100&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Critical Bug CSCva61927 Assets',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&cdetId=CSCva61927&rows=100&page=1`,
		usecases: ['Use Case 1'],
	},
];
