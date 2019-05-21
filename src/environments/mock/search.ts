import { SearchResults } from '../../app/services/search';

/**
 * Mock Data for search results
 * @ignore
 */
export const mockData: SearchResults = {
	highlightTerms: [
		'timeout',
		'new',
		'node',
		'dna',
		'cluster',
		'center configuration',
		'digital network architecture',
	],
	insight: {
		bug: {
			description: 'The problem you described could be caused by a known bug CSCvi74267',
			details: 'https://this.is.not.a.real.documentation.link',
		},
		devices: [
			{
				cxLevel: 1,
				model: 'Cisco DNA Center Applicance',
				swVersion: 'DNAC1.1',
			},
			{
				cxLevel: 1,
				model: 'Cisco DNA Center Applicance',
				swVersion: 'DNAC1.1',
			},
			{
				cxLevel: 1,
				model: 'Cisco DNA Center Applicance',
				swVersion: 'DNAC1.1',
			},
		],
		fix: {
			description: 'Upgrade to Cisco DNAC 1.2',
			details: 'https://this.is.not.a.real.documentation.link',
			download: 'https://not.a.real.download.link',
		},
		workaround: {
			description: 'Configure the switchport in trunk mode. Cisco DNAC 1.2',
			details: 'https://this.is.not.a.real.documentation.link',
		},
	},
	results: [
		{
			answered: 'Gauer Samal (Cisco Employee)',
			link: 'https://community.cisco.com',
			summary: 'deploying a master node in a DNA',
			title: 'Error when setting up new node in DNA',
			type: 'community',
		},
		{
			link: 'https://community.cisco.com',
			summary: 'Before adding a new node to the DNA Cluster',
			title: 'Cisco Digital Network Architecture Center Installation Guide, Release 1.2',
			type: 'document',
		},
		{
			link: 'https://community.cisco.com',
			start: 'the 2:20 mark',
			summary: 'Replay',
			title: 'Ask the Experts Replay: DNA Center Configuration Best Practices',
			type: 'presentation',
		},
		{
			link: 'https://community.cisco.com',
			summary: 'Is there a way to reset a DNA Center',
			title: 'Troubleshooting Switch Port and Interface Problems',
			type: 'document',
		},
		{
			link: 'https://community.cisco.com',
			start: '15:10',
			summary: 'Is there a way to reset a DNA Center',
			title: 'Ask the Experts Replay: Catalyst 6500 Optimization',
			type: 'presentation',
		},
		{
			link: 'https://community.cisco.com',
			summary: 'Is there a way to reset a DNA Center',
			title: 'Catalyst 6500 Release 12.2SX Software Configuration Guide',
			type: 'document',
		},
		{
			answered: 'Gauer Samal (Cisco Employee)',
			link: 'https://community.cisco.com',
			summary: 'Is there a way to reset a DNA Center',
			title: 'MSFC can\'t ping BVI interface address on transparent FWSM v3.1',
			type: 'community',
		},
		{
			answered: 'Gauer Samal (Cisco Employee)',
			link: 'https://community.cisco.com',
			summary: 'Is there a way to reset a DNA Center',
			title: 'Cat6500 - HSRP Failing / High CPU Load',
			type: 'community',
		},
	],
};
