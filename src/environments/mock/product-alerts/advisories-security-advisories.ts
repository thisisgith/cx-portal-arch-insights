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
		"severity": "Critical",
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
	/* tslint:enable */
];

/**
 * Mocks the field notice response
 * @param rows the rows to return
 * @param page the page to return
 * @param filter IDs to filter
 * @returns mock response
 */
function MockData (
	rows?: number,
	page?: number,
	): SecurityAdvisoriesResponse {
	let data = _.cloneDeep(MockAdvisorySecurityAdvisories);
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
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
];
