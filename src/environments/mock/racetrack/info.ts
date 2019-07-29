import { RacetrackResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/pitstop/v1/info';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Stuff
 * @param solution the solution
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns the response
 */
function MockRacetrack (
	solution: string, usecase: string, pitstop?: string): RacetrackResponse {
	const currentPitstop = pitstop;

	return {
		solutions: [
			{
				description: `${solution.toUpperCase()} Solution`,
				name: solution.toUpperCase(),
				technologies: [
					{
						currentPitstop,
						description: `${usecase}`,
						name: 'Campus Network Assurance',
						pitstops: [
							{
								description: 'The first pitstop',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'DNAC discover network devices',
										isComplete: true,
										isCompleteAuto: true,
										isCompleteManual: true,
										isManaualOverride: true,
										manualCheckAllowed: true,
										name: 'Discover Devices',
										updateMethod: 'NA',
									},
									{
										description: '- Explore Cisco DNA Center feature, ' +
											'- Plan the deployment of your appliance',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Get to know Cisco DNA Center',
										updateMethod: 'MANUAL',
									},
									{
										description: 'Map WLCs',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Map WLCs to Sites',
										updateMethod: 'NA',
									},
									{
										description: 'Map APs',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Map APs to Sites',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Implement',
								isComplete: false,
								name: 'Implement',
								pitstopActions: [
									{
										description: 'desc',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Discover your network with Cisco DNA Center',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Build your network & site hierarchy',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Complete your Wireless Assurance setup',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Scale your endpoint deployment',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Use',
								isComplete: false,
								name: 'Use',
								pitstopActions: [
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Monitor Health of the Network',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Scale your Network Infrastructure',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'View Issues detected by Assurance',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Engage',
								isComplete: false,
								name: 'Engage',
								pitstopActions: [
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Scale your Network Infrastructure',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use Network Time Travel for forensic ' +
											'investigation of previous conditions',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'View and customize Issues detected by Assurance',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use advance troubleshooting assurance tools',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Adopt',
								isComplete: false,
								name: 'Adopt',
								pitstopActions: [
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Scale the Network Infrastructure',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Configure Cisco DNA Center system backups',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Add your management users to Cisco ' +
											'DNA Center based on their role',
										updateMethod: 'NA',
									},
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Change status on an Issue detected by Assurance',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Optimize',
								isComplete: false,
								name: 'Optimize',
								pitstopActions: [
									{
										description: 'desc',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Customer is on the latest version ' +
											'of the solution software version',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
					{
						currentPitstop,
						description: 'sd desc',
						name: 'Campus Network Segmentation',
						pitstops: [
							{
								description: 'Onboard',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Implement',
								isComplete: false,
								name: 'Implement',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Use',
								isComplete: false,
								name: 'Use',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Engage',
								isComplete: false,
								name: 'Engage',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Adopt',
								isComplete: false,
								name: 'Adopt',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Optimize',
								isComplete: false,
								name: 'Optimize',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
					{
						currentPitstop,
						description: 'Scalable Access Policy',
						name: 'Scalable Access Policy',
						pitstops: [
							{
								description: 'Onboard',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Implement',
								isComplete: false,
								name: 'Implement',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Use',
								isComplete: false,
								name: 'Use',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Engage',
								isComplete: false,
								name: 'Engage',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Adopt',
								isComplete: false,
								name: 'Adopt',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Optimize',
								isComplete: false,
								name: 'Optimize',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
					{
						currentPitstop,
						description: 'Network Device Onboarding',
						name: 'Network Device Onboarding',
						pitstops: [
							{
								description: 'Onboard',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Implement',
								isComplete: false,
								name: 'Implement',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Use',
								isComplete: false,
								name: 'Use',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Engage',
								isComplete: false,
								name: 'Engage',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Adopt',
								isComplete: false,
								name: 'Adopt',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Optimize',
								isComplete: false,
								name: 'Optimize',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
					{
						currentPitstop,
						description: 'Campus Software Image Management',
						name: 'Campus Software Image Management',
						pitstops: [
							{
								description: 'Onboard',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Onboard 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Implement',
								isComplete: false,
								name: 'Implement',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Implement 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Use',
								isComplete: false,
								name: 'Use',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Use 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Engage',
								isComplete: false,
								name: 'Engage',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 1',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Engage 2',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Adopt',
								isComplete: false,
								name: 'Adopt',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Adoption of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
							{
								description: 'Optimize',
								isComplete: false,
								name: 'Optimize',
								pitstopActions: [
									{
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of Some Stuff',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Optimize of some Other stuff',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
				],
			},
		],
	};
}

/**
 * The Scenarios
 */
export const RacetrackScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(Racetrack) IBN-Assurance-Onboard',
					response: {
						body: MockRacetrack('ibn', 'assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(Racetrack) IBN-Assurance-Implement',
					response: {
						body: MockRacetrack('ibn', 'assurance', 'Implement'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
