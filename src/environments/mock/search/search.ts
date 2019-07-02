import { CDCSearchResponse, GlobalSearchResponse } from '@sdp-api';
/** base API for search */
const api = '/api/customerportal/search/v1';
/** base API for typeahead search */
const typeaheadApi = '/esps/search/suggest';

/**
 * Mock body of results
 */
const mockData: CDCSearchResponse = {
	/* tslint:disable */
	documents: [
		{
      "fields": {
        "uri": [
          "https://www.cisco.com/c/en/us/training-events/training-certifications/exams/current-list.html"
        ],
        "filetype": [
          "HTML"
        ],
        "title": [
          "Current Exam List"
        ],
        "date": [
          "2019-03-12T16:51:52.000-0400"
        ],
        "cdcdescription": [
          "The following list identifies all currently available exams by certification and track. In some cases, different tracks may require the same exam. Exams required for more than one track are listed within each track. All exams are available worldwide in English."
        ],
        "text": [
          "... Cisco <key>testing</key> delivery partner for availability in your area. Career Certifications Exams Track Certification ... day to <key>test</key>: February 28, 2019 Designing the FlexPod Solution (FPDESIGN) English Data Center Cisco and ... day to <key>test</key>: February 28, 2019 Implementing and Administering the FlexPod Solution English Internet of ..."
        ],
        "size": [
          88038
        ],
        "contenttype": [
          "cisco.com#US#preSales"
        ],
        "accesslevel": [
          "Guest",
          "Customer",
          "Partner",
          "Employee"
        ],
        "lllisting": [
          "true",
          "true"
        ],
        "teaser": [
          "Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Training &amp; Events ... "
        ],
        "filesize": [
          85
        ],
        "score": [
          1.8252939
        ],
        "displaytitle": [
          "Current Exam List"
        ],
        "collapseuri": [
          "https://www.cisco.com/c/en/us/training-events/training-certifications/exams/current-list.html"
        ],
        "iocontentsource": [
          "WEM"
        ],
        "impressionid": [
          "e8c41151544c0f7d13a43bf0d87be926"
        ]
      }
    },
    {
      "fields": {
        "uri": [
          "https://www.cisco.com/c/en/us/training-events/training-certifications/exams.html"
        ],
        "filetype": [
          "HTML"
        ],
        "title": [
          "Exams"
        ],
        "date": [
          "2019-03-01T17:28:42.000-0500"
        ],
        "cdcdescription": [
          "The main requirement for obtaining Cisco Career Certifications is to take and pass one or more certification exams. Passing exams give network professionals the chance to prove their networking knowledge and expertise."
        ],
        "text": [
          "... authorized <key>testing</key> center prior to taking any Cisco Certification exam. Candidates who do not agree will not ... of the <key>testing</key> session, candidates will receive a score report that includes a score breakout by exam ..."
        ],
        "size": [
          95264
        ],
        "contenttype": [
          "cisco.com#US#preSales"
        ],
        "accesslevel": [
          "Guest",
          "Customer",
          "Partner",
          "Employee"
        ],
        "lllisting": [
          "true",
          "true"
        ],
        "teaser": [
          "Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Training &amp; Events ... "
        ],
        "filesize": [
          93
        ],
        "score": [
          0.859269
        ],
        "displaytitle": [
          "Exams"
        ],
        "collapseuri": [
          "https://www.cisco.com/c/en/us/training-events/training-certifications/exams.html"
        ],
        "iocontentsource": [
          "WEM"
        ],
        "impressionid": [
          "739f4c85bf4ec054b509e75c8b836c63"
        ]
      }
    },
    {
      "fields": {
        "uri": [
          "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.html",
          "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.pdf",
          "https://content.cisco.com/chapter.sjs?uri=/searchable/chapter/www.cisco.com/content/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.html.xml"
        ],
        "filetype": [
          "HTML",
          "PDF",
          "HTML"
        ],
        "title": [
          "Release 15.3SY Supervisor Engine 6T Software Configuration Guide - Online Diagnostic <key>Tests</key> [Cisco Catalyst 6500 Series Switches]",
          "Online Diagnostic <key>Tests</key>",
          "Online Diagnostic <key>Tests</key>"
        ],
        "date": [
          "2019-03-19T10:18:09.000-0400",
          "2016-10-01T03:24:48.000-0400"
        ],
        "cdcdescription": [
          "Global Health-Monitoring <key>Tests</key>, Per-Port <key>Tests</key>, PFC Layer 2 <key>Tests</key>, DFC Layer 2 <key>Tests</key>, PFC Layer 3 <key>Tests</key>, DFC Layer 3 <key>Tests</key>, Replication Engine <key>Tests</key>, Fabric <key>Tests</key>, Exhaustive Memory <key>Tests</key>, Service Module <key>Tests</key>, Stress <key>Tests</key>, General <key>Tests</key>, Critical Recovery <key>Tests</key>, ViSN <key>Tests</key>",
          "Global Health-Monitoring <key>Tests</key>, Per-Port <key>Tests</key>, PFC Layer 2 <key>Tests</key>, DFC Layer 2 <key>Tests</key>, PFC Layer 3 <key>Tests</key>, DFC Layer 3 <key>Tests</key>, Replication Engine <key>Tests</key>, Fabric <key>Tests</key>, Exhaustive Memory <key>Tests</key>, Service Module <key>Tests</key>, Stress <key>Tests</key>, General <key>Tests</key>, Critical Recovery <key>Tests</key>, ViSN <key>Tests</key>",
          "Release 15.3SY Supervisor Engine 6T Software Configuration Guide"
        ],
        "text": [
          "... Diagnostic <key>Tests</key> Global Health-Monitoring <key>Tests</key> Per-Port <key>Tests</key> PFC Layer 2 <key>Tests</key> DFC Layer 2 <key>Tests</key> PFC Layer 3 <key>Tests</key> DFC Layer 3 <key>Tests</key> Replication Engine <key>Tests</key> Fabric <key>Tests</key> Exhaustive Memory <key>Tests</key> Service Module <key>Tests</key> Stress <key>Tests</key> General <key>Tests</key> Critical Recovery <key>Tests</key> ViSN <key>Tests</key> Note ● For information about ...",
          "... Diagnostic <key>Tests</key>  • Global Health-Monitoring <key>Tests</key>, page86-2  • Per-Port <key>Tests</key>, page86-8  • PFC Layer 2 <key>Tests</key>, ... Module <key>Tests</key>, page86-41  • Stress <key>Tests</key>, page86-42  • General <key>Tests</key>, page86-44  • Critical Recovery <key>Tests</key>, ... Diagnostic <key>Tests</key>  ViSN <key>Tests</key>  TestVSActiveToStandbyLoopback This <key>test</key> is the only GOLD <key>test</key> that <key>tests</key> the ...",
          "Release 15.3SY Supervisor Engine 6T Software Configuration Guide"
        ],
        "size": [
          392386,
          583677
        ],
        "contenttype": [
          "cisco.com#US#preSales",
          "cisco.com#US#preSales"
        ],
        "accesslevel": [
          "Guest",
          "Customer",
          "Partner",
          "Employee",
          "Guest",
          "Customer",
          "Partner",
          "Employee",
          "Guest",
          "Customer",
          "Partner"
        ],
        "lllisting": [
          "true",
          "true",
          "true"
        ],
        "teaser": [
          "Skip to content Skip to footer Cisco.com Worldwide MENU CLOSE Search Log In Log Out Choose Language Selection us en View More Log In Log Out  Log Out My Account Log Out Manage employee profile (HRMS) Manage CCO profile Employee Connection Cisco Employee Connection People Directory Employee Services Support &amp; Tools Employee Communities Cisco Assistant Choose Language Selection us en  Choose Language Selection Products &amp; Services Support &amp; Downloads Training &amp; Events Buy Partners Home Support Product ... ",
          "86-1  Supervisor Engine 6T Software Configuration Guide, Release15.3SY  APPENDIX 86  Online Diagnostic <key>Tests</key>  • Global Health-Monitoring <key>Tests</key>, page86-2  • Per-Port <key>Tests</key>, page86-8  • PFC Layer 2 <key>Tests</key>, page86-15  • DFC Layer 2 <key>Tests</key>, page86-17  • PFC Layer 3 <key>Tests</key>, page86-22  • DFC Layer 3 <key>Tests</key>, page86-28  • Replication Engine <key>Tests</key>, page86-34  • Fabric <key>Tests</key>, page86-35  • Exhaustive Memory <key>Tests</key>, page86-40  • Service Module <key>Tests</key>, page86-41  • Stress <key>Tests</key>, page86-42  • General <key>Tests</key>, page86-44 ... "
        ],
        "filesize": [
          383,
          569,
          10000
        ],
        "score": [
          0.67559445
        ],
        "displaytitle": [
          "Release 15.3SY Supervisor Engine 6T Software Configuration Guide - Online Diagnostic <key>Tests</key> [Cisco Catalyst 6500 Series Switches]",
          "Online Diagnostic <key>Tests</key>",
          "Cisco Catalyst 6500 Series Switches-Online Diagnostic <key>Tests</key>"
        ],
        "collapseuri": [
          "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.html",
          "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.pdf",
          "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst6500/ios/15-3SY/config_guide/sup6T/15_3_sy_swcg_6T/diagnostic_tests.html"
        ],
        "iocontentsource": [
          "WEM",
          "ContentHub-Non-XML"
        ],
        "impressionid": [
          "c96efa76093c019365d8df398814a233",
          "9e34c2510d4196bee0eb97c672f51c1b"
        ]
      },
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
		{
			buckets: [
				{
					count: 484,
					filter: 'site:PHRASE(TERM(Bug Info, TOKENIZED), facet=true, filter=true)',
					label: 'Bug Info',
				},
				{
					count: 20,
					filter: 'site:PHRASE(TERM(Case Studies, TOKENIZED), facet=true, filter=true)',
					label: 'Case Studies',
				},
				{
					count: 10137,
					filter: 'site:PHRASE(TERM(Command References, TOKENIZED), facet=true, filter=true)',
					label: 'Command References',
				},
				{
					count: 73937,
					filter: 'site:PHRASE(TERM(Compatibility Information, TOKENIZED), facet=true, filter=true)',
					label: 'Compatibility Information',
				},
			],
			label: 'Site Subcategory',
		},
	],
	totalHits: 10,
	totalTime: 32,
};

const mockDataWithSearchToken = {
	...mockData,
	searchToken: 'Special Search Token',
}

const mockGlobalResponse: GlobalSearchResponse = {
	 "communitySearch":{
			"totalHits":2489,
			"totalTime":42,
			"facets":[
			],
			"documents":[
				 {
						"fields":{
							 "title":[
									"Changing logging level of services on <key>DNA Center<\/key>"
							 ],
							 "uri":[
									"https:\/\/community-stage.cisco.com\/t5\/network-architecture-videos\/changing-logging-level-of-services-on-dna-center\/ba-p\/3189205",
									"https:\/\/community-stage.cisco.com\/t5\/network-architecture-videos\/changing-logging-level-of-services-on-dna-center\/ba-p\/3189205"
							 ],
							 "csctype":[
									"blog"
							 ],
							 "csckudos":[
									"0",
									"0"
							 ],
							 "cscauthor":[
									"Alexandro Carrasquedo"
							 ],
							 "cscauthorhref":[
									"https:\/\/community-stage.cisco.com\/t5\/user\/viewprofilepage\/user-id\/293071"
							 ],
							 "csclastupdatedby":[
									"hiarteag"
							 ],
							 "csclastupdatedbyhref":[
									"https:\/\/community-stage.cisco.com\/t5\/user\/viewprofilepage\/user-id\/177110"
							 ],
							 "csccreateddate":[
									"2017-09-25T13:44:15.000-0400"
							 ],
							 "csclastmodified":[
									"2017-10-18T11:37:50.000-0400"
							 ],
							 "cscviews":[
									140,
									0
							 ],
							 "csccommunity":[
									"\/technology-support\/4461-network-infrastructure"
							 ],
							 "cscboardhref":[
									"https:\/\/community-stage.cisco.com\/t5\/network-architecture-videos\/bg-p\/4461-videos-network-infrastructure"
							 ],
							 "cscboardid":[
									"4461-videos-network-infrastructure"
							 ],
							 "cscboardtitle":[
									"Network Architecture Videos"
							 ],
							 "csctags":[
									"cisco",
									"digital Network architecture",
									"dna",
									"guide",
									"service providers",
									"troubleshooting"
							 ],
							 "csclabels":[
									"Digital Network Architecture (DNA)"
							 ],
							 "cscid":[
									"3189205"
							 ],
							 "csclanguage":[
									"en"
							 ],
							 "replycount":[
									0,
									0
							 ],
							 "attachmentcount":[
									0
							 ],
							 "videocount":[
									1
							 ],
							 "imagecount":[
									0
							 ],
							 "teaser":[
									"Changing logging level of services on <key>DNA Center<\/key> (view in My Videos) If you're troubleshooting <key>DNA Center<\/key> related problems, you may need to have more detailed information for a specific service, this can be done by changing the logging level on <key>DNA Center<\/key>. This video will guide you through this process."
							 ]
						}
				 }
			]
	 },
	 "acc":{
			"documents":[
				 {
						"domain":"acc",
						"search":[
							 {
									"Archetype":"Feature Deep-dive",
									"Pitstop":"Use",
									"Use Case":"Wireless Assurance",
									"Title":"Cisco DNA Assurance Overview",
									"Customer Question":"",
									"Technology":"Wireless Assurance",
									"Short Description":"",
									"createdDate":"06-12-2019 21:35:19",
									"updatedDate":"06-20-2019 17:26:05"
							 },
						]
				 }
			]
	 },
	 "atx-future":{
			"documents":[
				 {
						"domain":"atx",
						"search":[
							 {
									"Use Case":"Network Segmentation",
									"TKL Session Staff":"Romeo Mezzaluna \/ Jessica Jackson",
									"Pit Stop":"Adopt",
									"Session Name":"Cisco DNA Center Platform Features & Capabilities",
									"Technology Area":"Cisco DNA Center",
									"Panelist Link":"",
									"Session Description":"Get an expert walkthrough of the Cisco DNA Center appliance and its important role in \nyour deployment, including product features, installation guidance, and product specifications.",
									"Date":"2018-11-01",
									"Attendee Link":"",
									"createdDate":"06-12-2019 21:35:13",
									"updatedDate":"06-20-2019 17:26:00"
							 },
						]
				 }
			]
	 },
	 "elearning":{
			"documents":[
				 {
						"domain":"elearning",
						"search":[
							 {
									"id":"60352",
									"title":"Cisco DNA Center Release 1.2",
									"description":null,
									"url":"https:\/\/pilot-digital-learning.cisco.com\/cx\/#\/course\/60352",
									"url_type":null,
									"type":"E-Courses",
									"duration":"3hr 18min",
									"rating":null,
									"level":"1",
									"order":"0",
									"createdDate":"06-07-2019 15:04:37",
									"updatedDate":"06-07-2019 15:04:52"
							 }
						]
				 }
			]
	 }
}

/* tslint:enable */

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
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Generic Example',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 8000) + 5000,
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
					delay: Math.floor(Math.random() * 2000) + 1000,
					description: 'Failure Response',
					response: {
						status: 404,
						statusText: 'Unable to find results',
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 1000,
					description: 'Response with Search Token',
					response: {
						body: mockDataWithSearchToken,
						status: 200,
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
	{
		scenarios: {
			POST: [
				{
					delay: 500,
					description: 'Generic Related Results Example',
					response: {
						body: mockGlobalResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/globalSearch`,
		usecases: ['Example', 'More Example'],
	},
];
