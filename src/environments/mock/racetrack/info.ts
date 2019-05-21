import { RacetrackResponse } from '@cui-x/sdp-api';

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
						description: `${usecase} Use Case`,
						name: 'Assurance',
						pitstops: [
							{
								description: 'The first pitstop',
								isComplete: false,
								name: 'Onboard',
								pitstopActions: [
									{
										description: 'DNAC discover network devices',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: true,
										isManaualOverride: true,
										manualCheckAllowed: true,
										name: 'Discover Devices',
										updateMethod: 'MANUAL',
									},
									{
										description: 'The hierarchy',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Configure Network Hierarchy',
										updateMethod: 'NA',
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
										description: 'sdfsd',
										isComplete: true,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Add Your Configurations',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'Some other Implementation',
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
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
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
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
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
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
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
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
										updateMethod: 'NA',
									},
									{
										description: 'sdfsd',
										isComplete: false,
										isCompleteAuto: false,
										isCompleteManual: false,
										isManaualOverride: false,
										manualCheckAllowed: false,
										name: 'sdfsd',
										updateMethod: 'NA',
									},
								],
							},
						],
					},
					{
						currentPitstop,
						description: `${usecase} Use Case`,
						name: 'SD-Access',
						pitstops: [
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
					delay: 250,
					description: '(Racetrack) IBN-Assurance-Onboard',
					response: {
						body: MockRacetrack('ibn', 'assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 250,
					description: '(Racetrack) IBN-Assurance-Implement',
					response: {
						body: MockRacetrack('ibn', 'assurance', 'Implement'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=assurance&solution=ibn`,
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(Racetrack) IBN-SDAccess-Adopt',
					response: {
						body: MockRacetrack('ibn', 'sd-access', 'Adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=sd-access&solution=ibn`,
	},
];
