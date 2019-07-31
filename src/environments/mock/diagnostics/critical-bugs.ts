import {
	CriticalBug,
	CriticalBugsCount,
	CriticalBugsResponse,
	DiagnosticsPagination as Pagination,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** The customerId */
const customerId = '2431199';

/** base API for user info */
const api = '/api/customerportal/diagnostics/v1/critical-bugs';

/**
 * Mock body of results
 */
const mockCounts: CriticalBugsCount = {
	closed: 0,
	duplicate: 0,
	new: 1,
	resolved: 1,
	verified: 0,
};

/** The Mock bugs  */
export const CriticalBugData: CriticalBug[] = [
	/* tslint:disable */
	{
		"id": "CSCto03123",
		"title": "cman-fp/cman-cc slow memory leak is seen",
		"description": "A slow memory leak is seen on cmfp and cmcc.",
		"state": "resolved",
		"severity": "notice",
		"publishedOn": "2019-07-10T07:37:34.993Z",
		"lastUpdated": "2019-07-15T10:57:34.255Z",
		"assetsImpacted": 2
	},
	{
		"id": "CSCva61927",
		"title": "Cisco IOS Software for Cisco Catalyst 6800 Series Switches VPLS Denial of Service Vulnerability",
		"description": "1. Apply necessary configs to make 3 PE full mesh VPLS topology and make sure that all VCs are UP. \r\n   Create l2 VFI using auto discovery. Attached the UUT running config. \r\n2. Enable MLDSN on xconnect vlan 10. configure CE-1 as MLDSN Querier for VLAN 10\r\n3. Check ipv6 mldsn mrouter ports are updated correctly on all the PEs\r\n4. on PE-2, core facing interface is configured in Macroon LC.\r\n\r\nUpon creating 1000 IPv6 host on IXIA port connected to CE-1 or PE-1, Macroon LC in PE-2 crashed.\r\nThe same crash is seen on idle state with 1000 VFI ( each vlan has 1 host configured in IXIA )\r\n\r\nAttached the complete logs, sh_mod_ver details.\r\n\r\nReproducible: consistent\r\n\r\nExpected behaviour: NO Crash should be seen \r\n\r\nWorkaround: Dont have Macroon LC as core facing interafce.\r\n\r\nImpact: LC crash\r\n\r\nImage used: c6848x-adventerprisek9_dbg-mz.SSA.154-1.IA001.106_20160717",
		"state": "new",
		"severity": "notice",
		"publishedOn": "2019-07-18T07:37:34.993Z",
		"lastUpdated": "2019-07-20T10:57:34.255Z",
		"assetsImpacted": 3
	},
	/* tslint:enable */
];

/**
 * Mocks the field notice response
 * @param rows the rows to return
 * @param page the page to return
 * @param state states to filter
 * @param id ids to filter
 * @returns mock response
 */
function MockData (
	rows?: number,
	page?: number,
	state?: string[],
	id?: string[],
): CriticalBugsResponse {
	let data = _.cloneDeep(CriticalBugData);
	const total = data.length;
	let pagination: Pagination;

	if (state && state.length) {
		data = _.filter(data, d => _.find(state, f => f === d.state));
	}

	if (id && id.length) {
		data = _.filter(data, d => _.find(id, f => f === d.id));
	}

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
export const CriticalBugScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bug State Counts',
					response: {
						body: mockCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/state/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bug Get CSCto03123',
					response: {
						body: MockData(1, 1, [], ['CSCto03123']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&page=1&id=CSCto03123`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bug Get CSCva61927',
					response: {
						body: MockData(1, 1, [], ['CSCva61927']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&page=1&id=CSCva61927`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs (New)',
					response: {
						body: MockData(10, 1, ['new']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&state=new&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs (Resolved)',
					response: {
						body: MockData(10, 1, ['resolved']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&state=resolved&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
];