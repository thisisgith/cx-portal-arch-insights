import { CDCSearchResponse } from '@cui-x/sdp-api';
/** base API for search */
const api = '/api/customerportal/search/v1';
/** base API for typeahead search */
const typeaheadApi = '/esps/search/suggest';

/**
 * Mock body of results
 */
const mockData: CDCSearchResponse = {
	/* tslint:disable:max-line-length ter-max-len no-irregular-whitespace object-literal-sort-keys*/
	documents: [
		{
			uri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams\/current-list.html',
			filetype: 'HTML',
			title: 'Current Exam List',
			date: '2019-03-12T16:51:52.000-0400',
			cdcdescription: 'The following list identifies all currently available exams by certification and track. In some cases, different tracks may require the same exam. Exams required for more than one track are listed within each track. All exams are available worldwide in English.',
			text: '... Cisco <key>testing<\/key> delivery partner for availability in your area. Career Certifications Exams Track Certification ... day to <key>test<\/key>: February 28, 2019 Designing the FlexPod Solution (FPDESIGN) English Data Center Cisco and ... day to <key>test<\/key>: February 28, 2019 Implementing and Administering the FlexPod Solution English Internet of ...',
			size: 88038,
			contenttype: 'cisco.com#US#preSales',
			accesslevel: 'Guest',
			lllisting: 'true',
			teaser: 'Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Training &amp; Events ... ',
			filesize: 85,
			score: 1.8252969,
			displaytitle: 'Current Exam List',
			collapseuri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams\/current-list.html',
			iocontentsource: 'WEM',
			impressionid: 'e8c41151544c0f7d13a43bf0d87be926',
		},
		{
			uri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams.html',
			filetype: 'HTML',
			title: 'Exams',
			date: '2019-03-01T17:28:42.000-0500',
			cdcdescription: 'The main requirement for obtaining Cisco Career Certifications is to take and pass one or more certification exams. Passing exams give network professionals the chance to prove their networking knowledge and expertise.',
			text: '... authorized <key>testing<\/key> center prior to taking any Cisco Certification exam. Candidates who do not agree will not ... of the <key>testing<\/key> session, candidates will receive a score report that includes a score breakout by exam ...',
			size: 95264,
			contenttype: 'cisco.com#US#preSales',
			accesslevel: 'Guest',
			lllisting: 'true',
			teaser: 'Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Training &amp; Events ... ',
			filesize: 93,
			score: 0.85927206,
			displaytitle: 'Exams',
			collapseuri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams.html',
			iocontentsource: 'WEM',
			impressionid: '739f4c85bf4ec054b509e75c8b836c63',
		},
		{
			uri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams.html',
			filetype: 'HTML',
			title: 'Some other results here',
			date: '2019-03-01T17:28:42.000-0500',
			cdcdescription: 'This has a really long description. A really, really long description. A really, really, really long description. A really, really long description. A really, really, really long description. A really, really long description. A really, really, really long description. A really, really long description. A really, really, really long description. A really, really long description. A really, really, really long description. A really, really long description. A really, really, really long description.',
			text: '... authorized <key>testing<\/key> center prior to taking any Cisco Certification exam. Candidates who do not agree will not ... of the <key>testing<\/key> session, candidates will receive a score report that includes a score breakout by exam ...',
			size: 95264,
			contenttype: 'cisco.com#US#preSales',
			accesslevel: 'Guest',
			lllisting: 'true',
			teaser: 'Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Training &amp; Events ... ',
			filesize: 93,
			score: 0.85927206,
			displaytitle: 'Some other results here.',
			collapseuri: 'https:\/\/www.cisco.com\/c\/en\/us\/training-events\/training-certifications\/exams.html',
			iocontentsource: 'WEM',
			impressionid: '739f4c85bf4ec054b509e75c8b836c63',
		},
	],
	facets: [
		{
			buckets: [
				{
					count: 484,
					filter: 'site:PHRASE(TERM(Downloads, TOKENIZED), facet=true, filter=true)',
					label: 'Downloads',
				},
				{
					count: 20,
					filter: 'site:PHRASE(TERM(Partners, TOKENIZED), facet=true, filter=true)',
					label: 'Partners',
				},
				{
					count: 10137,
					filter: 'site:PHRASE(TERM(\'Products & Services\', TOKENIZED), facet=true, filter=true)',
					label: 'Products & Services',
				},
				{
					count: 73937,
					filter: 'site:PHRASE(TERM(Support, TOKENIZED), facet=true, filter=true)',
					label: 'Support',
				},
				{
					count: 3,
					filter: 'site:PHRASE(TERM(Tools, TOKENIZED), facet=true, filter=true)',
					label: 'Tools',
				},
				{
					count: 3692,
					filter: 'site:PHRASE(TERM(\'Training & Events\', TOKENIZED), facet=true, filter=true)',
					label: 'Training & Events',
				},
			],
			label: 'Site',
		},
	],
	totalHits: 10,
	totalTime: 32,
	/* tslint:enable */
};

/* tslint:disable */
const mockTypeaheadResponse = {
	 "responses":[
			{
				 "hits":{
						"hits":[
							 {
									"_source":{
										 "cdc_displaytext":"Redundant Power System 2300",
										 "cdc_displaytext1":"Redundant Power System 2300",
										 "cdc_submittext":"Redundant Power System 2300",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"Redundant Power Systems",
										 "cdc_displaytext1":"Redundant Power Systems",
										 "cdc_submittext":"Redundant Power Systems",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"1800/2800/3800 Series 8-Port Async/Sync EIA-232 Serial High-Speed WAN Interface Card",
										 "cdc_displaytext1":"1800/2800/3800 Series 8-Port Async/Sync EIA-232 Serial High-Speed WA",
										 "cdc_submittext":"1800/2800/3800 Series 8-Port Async/Sync EIA-232 Serial High-Speed WAN Interface Card",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"IOS Software Release 12.2(23)SW",
										 "cdc_displaytext1":"IOS Software Release 12.2(23)SW",
										 "cdc_submittext":"IOS Software Release 12.2(23)SW",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"Nexus 2348TQ-E 10GE Fabric Extender",
										 "cdc_displaytext1":"Nexus 2348TQ-E 10GE Fabric Extender",
										 "cdc_submittext":"Nexus 2348TQ-E 10GE Fabric Extender",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"2800/3800 Series 23-Port EtherSwitch Service Module",
										 "cdc_displaytext1":"2800/3800 Series 23-Port EtherSwitch Service Module",
										 "cdc_submittext":"2800/3800 Series 23-Port EtherSwitch Service Module",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 },
							 {
									"_source":{
										 "cdc_displaytext":"Nexus 2348TQ 10GE Fabric Extender",
										 "cdc_displaytext1":"Nexus 2348TQ 10GE Fabric Extender",
										 "cdc_submittext":"Nexus 2348TQ 10GE Fabric Extender",
										 "cdc_category_name":"Uncategorized"
									},
									"fields":{
										 "search_type":[
												"uncategorized"
										 ]
									}
							 }
						]
				 }
			}
	 ]
};
/* tslint:enable */

/**
 * The scenarios
 */
export const SearchScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 500,
					description: 'Generic Example',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 5000,
					description: 'Empty Response',
					response: {
						body: {
							documents: [],
							facets: [],
							totalHits: 0,
							totalTime: 12,
						},
						status: 200,
					},
				},
				{
					delay: 1000,
					description: 'Failure Response',
					response: {
						status: 404,
						statusText: 'Unable to find results',
					},
				},
			],
		},
		url: `${api}/cdcSearch`,
		usecases: ['Example', 'More Example'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 300,
					description: 'Typeahead Example',
					response: {
						body: mockTypeaheadResponse,
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${typeaheadApi}/cdcpr01zad?q=Test&locale=enus&bizcontext=ENT&h=7`,
		usecases: ['Example', 'More Example'],
	},
];
