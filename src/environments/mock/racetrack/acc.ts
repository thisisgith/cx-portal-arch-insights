import { ACCResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/acc';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockACC (
	solution: string, usecase: string, pitstop: string): ACCResponse {
	let items = [
		{
			description: 'Discover the standard steps required to engineer and commission ' +
				'your appliance from an experienced Cisco DNA Center project manager. Understand ' +
				'basic deployment requirements and schedules',
			status: 'recommended',
			title: 'Cisco DNA Center Project Planning',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			description: 'Gain actionable insights into Cisco DNA Center use case ' +
				'deployments and assists. Understand how to design, adopt, and leverage to ' +
				'save time and resources within your network',
			status: 'scheduled',
			title: 'Cisco DNA Pilot Usecase Deployment',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			status: 'completed',
			title: 'Cisco DNA Center Wireless Assurance Feature Planning',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
	];

	if (pitstop.toLowerCase() === 'adopt') {
		items = [
			{
				description: 'This is a title for Adoption',
				status: 'completed',
				title: 'This is a title for Adoption',
				url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
			},
		];
	}

	return {
		items,
		pitstop,
		solution,
		usecase,
	};
}

/**
 * The scenarios
 */
export const ACCScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&` +
			`solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(ACC) IBN-SD Access-Onboard',
					response: {
						body: MockACC('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
