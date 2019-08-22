 import {
	ProductAlertsPagination as Pagination,
	SecurityAdvisoriesResponse,
	SecurityAdvisoryInfo,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/advisories-security-advisories';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
export const MockAdvisorySecurityAdvisories: SecurityAdvisoryInfo[] = [
	/* tslint:disable */
	{
		"id": 485,
		"severity": "Critical",
		"title": "Multiple Vulnerabilities in OpenSSL Affecting Cisco Products",
		"summary": "Multiple Cisco products incorporate a version of the OpenSSL package affected by one or more vulnerabilities that could allow an unauthenticated, remote attacker to execute arbitrary code, create a denial of service (DoS) condition, or perform a man-in-the-middle attack. On June 5, 2014, the OpenSSL Project released a security advisory detailing seven distinct vulnerabilities. The vulnerabilities are referenced in this document as follows: SSL/TLS Man-in-the-Middle Vulnerability DTLS Recursion Flaw Vulnerability DTLS Invalid Fragment Vulnerability SSL_MODE_RELEASE_BUFFERS NULL Pointer Dereference Vulnerability SSL_MODE_RELEASE_BUFFERS Session Injection or Denial of Service Vulnerability Anonymous ECDH Denial of Service Vulnerability ECDSA NONCE Side-Channel Recovery Attack Vulnerability Please note that the devices that are affected by this vulnerability are the devices acting as a Secure Sockets Layer (SSL) or Datagram Transport Layer Security (DTLS) server terminating SSL or DTLS connections or devices acting as an SSL client initiating an SSL or DTLS connection. Devices that are simply traversed by SSL or DTLS traffic without terminating it are not affected. Cisco will release software updates that address these vulnerabilities. Workarounds that mitigate these vulnerabilities may be available.",
		"assetsImpacted": 2,
		"assetsPotentiallyImpacted": 0,
		"publishedOn": "2014-06-05T22:40:00",
		"lastUpdated": "2018-12-07T00:00:00",
		"version": 1.28,
		"url": "http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20140605-openssl"
	},
	{
		"id": 89,
		"severity": "Medium",
		"title": "Voice Vulnerabilities in Cisco IOS and Cisco Unified Communications Manager",
		"summary": "Multiple voice-related vulnerabilities are identified in Cisco IOS software, one of which is also shared with Cisco Unified Communications Manager. These vulnerabilities pertain to the following protocols or features: Session Initiation Protocol (SIP) Media Gateway Control Protocol (MGCP) Signaling protocols H.323, H.254 Real-time Transport Protocol (RTP) Facsimile reception Cisco has made free software available to address these vulnerabilities for affected customers. Fixed Cisco IOS software listed in the Software Versions and Fixes section contains fixes for all vulnerabilities mentioned in this advisory. There are no workarounds available to mitigate the effects of any of the vulnerabilities apart from disabling the protocol or feature itself. This advisory is posted at http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-IOS-voice. Note:The August 08, 2007 publication includes four Security Advisories and one Security Response. The advisories all affect IOS, one additionally affects Cisco Unified Communications Manager as well. Each advisory lists the releases that correct the vulnerability described in the advisory, and the advisories also detail the releases that correct the vulnerabilities in all four advisories. Individual publication links are listed below: Cisco IOS Information Leakage Using IPv6 Routing Header http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-IOS-IPv6-leak Cisco IOS Next Hop Resolution Protocol Vulnerability http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-nhrp Cisco IOS Secure Copy Authorization Bypass Vulnerability http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-scp Voice Vulnerabilities in Cisco IOS and Cisco Unified Communications Manager http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-IOS-voice Cisco Unified MeetingPlace XSS Vulnerability http://tools.cisco.com/security/center/content/CiscoSecurityResponse/cisco-sr-20070808-mp",
		"assetsImpacted": 0,
		"assetsPotentiallyImpacted": 0,
		"publishedOn": "2007-08-08T16:00:00",
		"lastUpdated": "2007-08-08T16:00:00",
		"version": 2,
		"url": "http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20070808-IOS-voice"
	},
	{
		"id": 728,
		"severity": "High",
		"title": "Cisco IOS Software for Cisco Catalyst 6800 Series Switches VPLS Denial of Service Vulnerability",
		"summary": "A vulnerability in the Virtual Private LAN Service(VPLS) code of CiscoIOS Software for CiscoCatalyst 6800 Series Switches could allow an unauthenticated, adjacent attacker to cause a C6800-16P10G or C6800-16P10G-XL type line card to crash, resulting in a denial of service(DoS) condition. The vulnerability is due to a memory management issue in the affected software. An attacker could exploit this vulnerability by creating a large number of VPLS-generated MAC entries in the MAC address table of an affected device. A successful exploit could allow the attacker to cause a C6800-16P10G or C6800-16P10G-XL type line card to crash, resulting in a DoS condition. Cisco has released software updates that address this vulnerability. There are no workarounds that address this vulnerability.",
		"assetsImpacted": 0,
		"assetsPotentiallyImpacted": 0,
		"publishedOn": "2017-09-27T16:00:00",
		"lastUpdated": "2017-09-27T16:00:00",
		"version": 1,
		"url": "https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20170927-vpls"
	},
	{
		"id": 387,
		"severity": "Low",
		"title": "Multiple Vulnerabilities in Cisco IOS XE Software for 1000 Series Aggregation Services Routers",
		"summary": "Cisco IOS XE Software for 1000 Series Aggregation Services Routers (ASR) contains the following denial of service (DoS) vulnerabilities: Cisco IOS XE Software IPv6 Multicast Traffic Denial of Service Vulnerability Cisco IOS XE Software MVPNv6 Traffic Denial of Service Vulnerability Cisco IOS XE Software L2TP Traffic Denial of Service Vulnerability Cisco IOS XE Software Bridge Domain Interface Denial of Service Vulnerability Cisco IOS XE Software SIP Traffic Denial of Service Vulnerability These vulnerabilities are independent of each other; a release that is affected by one of the vulnerabilities may not be affected by the others. Successful exploitation of any of these vulnerabilities could allow an unauthenticated remote attacker to trigger a reload of the Embedded Services Processors (ESP) card or the Route Processor (RP) card, causing an interruption of services. Repeated exploitation couldresult in a sustained DoS condition. Note:Cisco IOS Software and Cisco IOS-XR Software are not affected by these vulnerabilities. Cisco has released software updates that address these vulnerabilities.",
		"assetsImpacted": 0,
		"assetsPotentiallyImpacted": 0,
		"publishedOn": "2013-04-15T16:00:00",
		"lastUpdated": null,
		"version": 1.3,
		"url": "http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20130410-asr1000"
	},
	{
		"id": 48,
		"title": "IOS HTTP Server Command Injection Vulnerability",
		"summary": "A vulnerability exists in the IOS HTTP server in which HTML code inserted into dynamically generated output, such as the output from a show buffers command, will be passed to the browser requesting the page. This HTML code could be interpreted by the client browser and potentially execute malicious commands against the device or other possible cross-site scripting attacks. Successful exploitation of this vulnerability requires that a user browse a page containing dynamic content in which HTML commands have been injected. Cisco will be making free software available to address this vulnerability for affected customers. There are workarounds available to mitigate the effects of the vulnerability. This advisory is posted at http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20051201-http.",
		"assetsImpacted": 1,
		"assetsPotentiallyImpacted": 2,
		"publishedOn": "2005-12-01T21:00:00",
		"lastUpdated": null,
		"version": 2.0,
		"url": "http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20051201-http"
	},
	{
		"id": 520,
		"title": "GNU Bash Environment Variable Command Injection Vulnerability",
		"summary": "On September 24, 2014, a vulnerability in the Bash shell was publicly announced. The vulnerability is related to the way in which shell functions are passed though environment variables. The vulnerability may allow an attacker to inject commands into a Bash shell, depending on how the shell is invoked. The Bash shell may be invoked by a number of processes including, but not limited to, telnet, SSH, DHCP, and scripts hosted on web servers. All versions of GNU Bash starting with version 1.14 are affected by this vulnerability and the specific impact is determined by the characteristics of the process using the Bash shell. In the worst case, an unauthenticated remote attacker would be able to execute commands on an affected server. However, in most cases involving Cisco products, authentication is required before exploitation could be attempted. A number of Cisco products ship with or use an affected version of the Bash shell. The Bash shell is a third-party software component that is part of the GNU software project and used by a number of software vendors. As of this version of the Security Advisory, there have been a number of vulnerabilities recently discovered in the Bash shell, and the investigation is ongoing. For vulnerable products, Cisco has included information on the product versions that will contain the fixed software, and the date these versions are expected to be published on the cisco.com download page. This advisory will be updated as additional information becomes available. Cisco may release free software updates that address this vulnerability if a product is determined to be affected by this vulnerability.",
		"assetsImpacted": 0,
		"assetsPotentiallyImpacted": 3,
		"publishedOn": "2014-09-26T01:00:00",
		"lastUpdated": null,
		"version": 1.29,
		"url": "http://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20140926-bash"
	},
	/* tslint:enable */
];

/**
 * Mocks the field notice response
 * @param rows the rows to return
 * @param page the page to return
 * @param copy the number of times to duplicate the data (for testing multiple pages)
 * @returns mock response
 */
function MockData (
	rows?: number,
	page?: number,
	copy?: number,
	): SecurityAdvisoriesResponse {
	let data = _.cloneDeep(MockAdvisorySecurityAdvisories);
	if (copy > 0) {
		for (let i = 0; i < copy; i += 1) {
			data = _.concat(data, ...data);
		}
	}
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

/** The scenarios */
export const AdvisorySecurityAdvisoryScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Advisory Security Advisories',
					response: {
						body: MockData(10, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 250,
					description: 'Advisory Security Advisories - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 250,
					description: 'Advisory Security Advisories - Page 1',
					response: {
						body: MockData(10, 1, 3),
						status: 200,
					},
					selected: false,
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
					delay: 250,
					description: 'Advisory Security Advisories - Page 2',
					response: {
						body: MockData(10, 2, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Advisory Security Advisories - Page 3',
					response: {
						body: MockData(10, 3, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=3`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Advisory Security Advisories for Asset',
					response: {
						body: MockData(10, 1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		/* tslint:disable */
		url: `${api}?customerId=${customerId}&sort=severity:ASC&rows=10&page=1&managedNeId=NA,FOC2045X0WJ,WS-C3850-48U-L,NA`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Security Advisories for FOC1544Y16T',
					response: {
						body: MockData(10, 1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=severity:ASC&rows=10&page=1&managedNeId=NA,FOC1544Y16T,WS-C2960S-24PS-L,NA`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Security Advisories for FOC1544Y16T - Page 2',
					response: {
						body: MockData(10, 2, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=severity:ASC&rows=10&page=2&managedNeId=NA,FOC1544Y16T,WS-C2960S-24PS-L,NA`,
		usecases: ['Use Case 1'],
	},
];
