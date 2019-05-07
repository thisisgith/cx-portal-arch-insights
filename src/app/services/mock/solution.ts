import { RacetrackResponseObject, WebinarResults } from '../solution';

/**
 * Mock data for webinar API results
 * @ignore
 */
export const mockATX: WebinarResults = {
	webinars: [
		{
			summary: 'Learn about interface and network design overview, policy management',
			title: 'Cisco DNA Center Getting Started',
		},
		{
			summary: 'A high level look at the planning stage of your project.  Address device',
			title: 'Cisco DNA Project Plan Best Practices',
		},
		{
			summary: 'Learn how to successfully transition from APIC-EM to Cisco DNA Center.',
			title: 'Cisco APIC-EM Infrastructure Transition Best Practices',
		},
		{
			summary: 'A high level look at the planning stage of your project.  Address device',
			title: 'Cisco DNA Project Plan Best Practices',
		},
		{
			summary: 'Learn about interface and network design overview, policy management and',
			title: 'Cisco DNA Center Getting Started',
		},
		{
			summary: 'A high level look at the planning stage of your project.  Address device',
			title: 'Cisco DNA Project Plan Best Practices',
		},
	],
};

/**
 * Mock data for racetrack API results
 * @ignore
 */
export const mockRacetrack: RacetrackResponseObject = {
	customerId: '55843',
	solutions: [
	  {
			description: 'IBN solution',
			name: 'ibn',
			technologies: [
				{
					currentPitstop: 'onboard',
					description: 'Assurance use case',
					name: 'assurance',
					pitstops: [
						{
							description: 'Onboard',
							isComplete: false,
							name: 'onboard',
							pitstopActions: [
								{
									description: 'Discover Devices',
									isComplete: false,
									name: 'discoverDevices',
								},
								{
									description: 'Configure Network Hierarchy',
									isComplete: false,
									name: 'configureNetworkHierarchy',
								},
								{
									description: 'Map WLCs To Sites',
									isComplete: false,
									name: 'mapWLCsToSites',
								},
								{
									description: 'Map APs To Sites',
									isComplete: false,
									name: 'mapAPsToSites',
								},
							],
						},
					],
				},
				{
					currentPitstop: 'engage',
					description: 'Sd Access use case',
					name: 'SD Access',
					pitstops: [
						{
							description: 'Engage',
							isComplete: false,
							name: 'engage',
							pitstopActions: [
								{
									description: 'SD Access Test 1',
									isComplete: true,
									name: 'Engage Test 1',
								},
								{
									description: 'SD Access Test 2',
									isComplete: true,
									name: 'Engage Test 2',
								},
								{
									description: 'Map WLCs To Sites',
									isComplete: false,
									name: 'mapWLCsToSites',
								},
								{
									description: 'Map APs To Sites',
									isComplete: false,
									name: 'mapAPsToSites',
								},
							],
						},
					],
				},
				{
					currentPitstop: 'use',
					description: 'Automation use case',
					name: 'automation',
					pitstops: [
						{
							description: 'Use',
							isComplete: false,
							name: 'use',
							pitstopActions: [
								{
									description: 'Automation Test 1',
									isComplete: true,
									name: 'Automation Test 1',
								},
								{
									description: 'Automation Test 3',
									isComplete: false,
									name: 'Automation Test 2',
								},
								{
									description: 'Map WLCs To Sites',
									isComplete: true,
									name: 'mapWLCsToSites',
								},
								{
									description: 'Map APs To Sites',
									isComplete: false,
									name: 'mapAPsToSites',
								},
							],
						},
					],
				},
			],
	 	},
	],
};
