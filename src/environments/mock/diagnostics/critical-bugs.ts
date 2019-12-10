import {
	CriticalBug,
	CriticalBugsCount,
	CriticalBugsResponse,
	DiagnosticsPagination as Pagination,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { HttpHeaders } from '@angular/common/http';

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
		"severity": "critical",
		"publishedOn": "2019-07-10T07:37:34.993Z",
		"lastUpdated": "2019-07-15T10:57:34.255Z",
		"assetsImpacted": 2,
		"cdets": {
			"headline": "C9407R - C9400-PWR-3200AC Power Supply goes into faulty state randomly ( \"n.a.\" )",
			"severity": "3"
		}
	},
	{
		"id": "CSCva61927",
		"title": "Cisco IOS Software for Cisco Catalyst 6800 Series Switches VPLS Denial of Service Vulnerability",
		"description": "1. Apply necessary configs to make 3 PE full mesh VPLS topology and make sure that all VCs are UP. \r\n   Create l2 VFI using auto discovery. Attached the UUT running config. \r\n2. Enable MLDSN on xconnect vlan 10. configure CE-1 as MLDSN Querier for VLAN 10\r\n3. Check ipv6 mldsn mrouter ports are updated correctly on all the PEs\r\n4. on PE-2, core facing interface is configured in Macroon LC.\r\n\r\nUpon creating 1000 IPv6 host on IXIA port connected to CE-1 or PE-1, Macroon LC in PE-2 crashed.\r\nThe same crash is seen on idle state with 1000 VFI ( each vlan has 1 host configured in IXIA )\r\n\r\nAttached the complete logs, sh_mod_ver details.\r\n\r\nReproducible: consistent\r\n\r\nExpected behaviour: NO Crash should be seen \r\n\r\nWorkaround: Dont have Macroon LC as core facing interafce.\r\n\r\nImpact: LC crash\r\n\r\nImage used: c6848x-adventerprisek9_dbg-mz.SSA.154-1.IA001.106_20160717",
		"state": "new",
		"severity": "info",
		"publishedOn": "2019-07-18T07:37:34.993Z",
		"lastUpdated": "2019-07-20T10:57:34.255Z",
		"assetsImpacted": 3,
		"cdets": {
			"headline": "C9407R - C9400-PWR-3200AC Power Supply goes into faulty state randomly ( \"n.a.\" )",
			"severity": "3"
		}
	},
	{
		"id": "CSCvm55520",
		"title": "This C9407R device running 16.8.1a is hitting Software Defect - CSCvm55520: C9407R - C9400-PWR-3200AC Power Supply goes into faulty state randomly ( \"n.a.\" )",
		"hostname": "Device_6_0_1_1",
		"ipAddress": "6.0.1.1",
		"description": "This C9407R device running 16.8.1a <b>is hitting</b> defect <a href=\"https://tools.cisco.com/bugsearch/bug/CSCvm55520\" target=\"_blank\">CSCvm55520</a>: C9407R - C9400-PWR-3200AC Power Supply goes into faulty state randomly ( \"n.a.\" )<br/><b>Symptom:</b><br/>\"show power\" output displays one of the power supplies as \"faulty\" <br/><br/>In \"show platform hardware chassis power-supply detail al\" output, affected power supply shows \"No faults\".<br/>Physical inspection of power supply shows all LED are green and operational.<br/><br/>PS1     C9400-PWR-3200AC      AC    3200 W    active        good  good  good  good<br/>PS2     C9400-PWR-3200AC      AC    3200 W    active        good  good  good  good<br/>PS3     C9400-PWR-3200AC      AC    3200 W    standby       n.a.  n.a.  n.a.  n.a.<br/>PS4     C9400-PWR-3200AC      AC    n.a.        faulty        n.a.  n.a.  n.a.  n.a.<br/>!<br/><br/>C9400#show platform hardware chassis power-supply detail al<br/>Slot      Reg       Reg Value       Description                                                          <br/> --------- --------- --------------- ---------------------------------------------------------------------<br/> PS1       0xE7      0x00 0x00 0x00 No Faults                                                             <br/> PS2       0xE7      0x00 0x00 0x00 No Faults                                                            <br/> PS3       0xE7      0x00 0x00 0x00 No Faults                                                            <br/> PS4       0xE7      0x00 0x00 0x00 No Faults<br/><br/><b>Conditions:</b><br/>The issue can be seen due to small glitch in power line or due to quick on/off of power supply switch. This is a rare timing issue.<br/><br/><b>Workaround:</b><br/>&gt;Physical re-seat of affected power supply restores it.<br/><br/><br/><b>Integrated Releases:</b><br/>Gibraltar-16.11.1 16.6(5.47) 16.9.4 16.9(3.2) 16.11.1 16.11(0.174) 16.11.1s 16.12(0.64) Fuji-16.9.4 16.11.1b 16.11.1c 16.11.1a Gibraltar-16.11.1a Gibraltar-16.11.1c Gibraltar-16.11.1b 16.12.1c 16.6.6 16.12.1a Gibraltar-16.12.1s 16.12.1d Gibraltar-16.11.1s 16.11(0.175) 16.12.1b 16.12.1s Gibraltar-16.12.1a Gibraltar-16.12.1b Gibraltar-16.12.1d<br/>",
		"state": "new",
		"severity": "warning",
		"publishedOn": "2019-09-26T23:48:16.658Z",
		"lastUpdated": "2019-11-18T15:06:00.110Z",
		"swVersion": "16.8.1a",
		"assetsImpacted": 416,
		"cdets": {
				"headline": "C9407R - C9400-PWR-3200AC Power Supply goes into faulty state randomly ( \"n.a.\" )",
				"severity": "3"
		}
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
	state?: string[],
	id?: string[],
	copy?: number,
): CriticalBugsResponse {
	let data = _.cloneDeep(CriticalBugData);
	if (copy > 0) {
		for (let i = 0; i < copy; i += 1) {
			data = _.concat(data, ...data);
		}
	}
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
				{
					delay: 0,
					description: 'Critical Bug State Counts - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
			],
		},
		url: `${api}/state/count?customerId=${customerId}`
			+ '&useCase=Campus Network Assurance&solution=IBN',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Critical Bugs - Page 2',
					response: {
						body: MockData(10, 2, null, null, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&sort=severity:ASC&rows=10&page=2',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Critical Bugs - Page 3',
					response: {
						body: MockData(10, 3, null, null, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&sort=severity:ASC&rows=10&page=3',
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
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance`
			+ '&solution=IBN&rows=1&page=1&cdetsId=CSCto03123',
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
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance`
			+ '&solution=IBN&rows=1&page=1&id=CSCva61927',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Critical Bugs',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Critical Bugs - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Critical Bugs - Page 1',
					response: {
						body: MockData(10, 1, null, null, 4),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance`
			+ '&sort=severity:ASC&solution=IBN&rows=10&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs for FOC1544Y16T',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=2431199&useCase=Campus Network Assurance&solution=IBN`
			+ '&serialNumber=FOC1544Y16T&rows=10&page=1',
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
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&state=new&sort=severity:ASC&rows=10&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Critical Bugs (Resolved)',
					response: {
						body: MockData(10, 1, ['resolved']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&state=resolved&sort=severity:ASC&rows=10&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs for Asset',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&serialNumber=35641136A1621&rows=10&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Critical Bugs - Count',
					response: {
						body: MockData(1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`
			+ '&rows=1&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Critical Bugs - Count',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': `${CriticalBugData.length}`,
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`,
		usecases: ['Use Case 1'],
	},
];
