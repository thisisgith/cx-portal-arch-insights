import {
	ProductAlertsPagination as Pagination,
	FieldNoticeBulletinResponse,
	FieldNoticeBulletin,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/field-notice-bulletins';

/** Default Customer ID */
// const customerId = '2431199';

/** The mock response for coverage counts */
const mockNoticeResponse: FieldNoticeBulletin[] = [
	/* tslint:disable */
	{
			"fieldNoticeId": 64223,
			"status": "P",
			"bulletinLastUpdated": "2018-12-10T00:00:00",
			"bulletinTitle": "FN64223 - Some 3650 switches may lose POE power on all ports and fail to boot if reset or power cycled - Replace on Failure",
			"bulletinFirstPublished": "2016-12-16T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01065&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63832,
			"status": "P",
			"bulletinLastUpdated": "2016-08-26T09:13:47",
			"bulletinTitle": "FN#63832: UCS-E1xxD modules may experience CATERR's or MC_IERRs and an unresponsive Host with \"SpeedStep\" enabled - SW workaround available",
			"bulletinFirstPublished": "2014-06-09T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn63832.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63379,
			"status": "P",
			"bulletinLastUpdated": "2019-01-29T00:00:00",
			"bulletinTitle": "FN63379 - ROMMON Boot variable setting may cause RP to boot or standby fail-over issue on few boards - No RMA needed - Workaround Provided",
			"bulletinFirstPublished": "2010-12-20T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01187&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62540,
			"status": "P",
			"bulletinLastUpdated": "2007-10-03T15:20:01",
			"bulletinTitle": "FN# 62540 CRS: CRS-MSC,CRS-8-RP,CRS-16-RP,8-10GBE,4OC192-SR,16OC48 Boards may have Flux contamination. RMA specific Serial Numbers.",
			"bulletinFirstPublished": "2006-09-28T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62540.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62079,
			"status": "P",
			"bulletinLastUpdated": "2006-06-22T16:53:37",
			"bulletinTitle": "FN 62079 - Cat4K WS-C4948 SFP slots  may not fit SFP from certain vendors",
			"bulletinFirstPublished": "2019-06-20T06:22:12",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62079.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63405,
			"status": "P",
			"bulletinLastUpdated": "2018-06-05T00:00:00",
			"bulletinTitle": "FN63405 - CISCO18XX & CISCO28XX Might Fail to Boot After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/634/fn63405.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63743,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63743 - Catalyst 6500 - Might Fail to Boot Up After a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63743.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64197,
			"status": "P",
			"bulletinLastUpdated": "2017-10-20T00:00:00",
			"bulletinTitle": "FN64197 - WAAS Devices That Run 6.1.1, 6.1.1a, or 6.2.1 Might Have Connections Reset  - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-09-01T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64197.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 62402,
			"status": "P",
			"bulletinLastUpdated": "2007-08-15T15:58:20",
			"bulletinTitle": "FN# 62402 CRS: CRS16 NEBs compliant Line Card Chassis (LCC) is now available. RMA old CRS16 chassis to obtain new chassis",
			"bulletinFirstPublished": "2019-06-26T10:29:40",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62402.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64291,
			"status": "P",
			"bulletinLastUpdated": "2017-10-11T00:00:00",
			"bulletinTitle": "FN64291 - ASA and FTD Software - Security Appliance Might Fail To Pass Traffic After 213 Days Of Uptime - Reboot Required - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-03-30T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64291.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64241,
			"status": "P",
			"bulletinLastUpdated": "2018-12-20T00:00:00",
			"bulletinTitle": "FN64241 - cBR-8-Potential Protect Line Card Reload Due to Memory Leak - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-02-21T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64241.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63564,
			"status": "P",
			"bulletinLastUpdated": "2018-01-08T00:00:00",
			"bulletinTitle": "FN63564 - Catalyst 3560X, 3750X, XPS-2200 Early Field Failures - Replace on Failure",
			"bulletinFirstPublished": "2012-09-19T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00707&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64153,
			"status": "P",
			"bulletinLastUpdated": "2017-11-13T00:00:00",
			"bulletinTitle": "FN64153 - ASR1000 - Inaccurate Power Supply Unit Status - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-07-07T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64153.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70326,
			"status": "P",
			"bulletinLastUpdated": "2019-01-31T00:00:00",
			"bulletinTitle": "FN70326 - cBR-8 - Potential Line Card Reload during Operation - Software Upgrade Recommended",
			"bulletinFirstPublished": "2019-01-31T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70326.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64196,
			"status": "P",
			"bulletinLastUpdated": "2018-12-07T00:00:00",
			"bulletinTitle": "FN64196 - The internal power supply in some Catalyst 3560C and 2960C compact switches may fail - Replace on Failure",
			"bulletinFirstPublished": "2016-11-11T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01061&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63760,
			"status": "P",
			"bulletinLastUpdated": "2018-06-11T00:00:00",
			"bulletinTitle": "FN63760 - CISCO3825 & CISCO3845 Might Fail to Boot After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63760.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63329,
			"status": "P",
			"bulletinLastUpdated": "2014-10-30T17:48:52",
			"bulletinTitle": "FN 63329: ISR-G2, 860, 880 & 890 Series Routers - Power circuitry may fail on routers: Fix on Fail only",
			"bulletinFirstPublished": "2010-07-13T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn63329.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63520,
			"status": "P",
			"bulletinLastUpdated": "2017-10-09T00:00:00",
			"bulletinTitle": "FN63520 - Small quantity of 2901 & 2911 may emit audible noise during operation - Replace on Failure ",
			"bulletinFirstPublished": "2012-07-02T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00045&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64227,
			"status": "P",
			"bulletinLastUpdated": "2016-12-22T22:17:21",
			"bulletinTitle": "FN - 64227 - ASA Software - Some Commands Might Fail on ASA 5500-X Security Appliances - Software Upgrade Required",
			"bulletinFirstPublished": "2016-12-22T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64227.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 62042,
			"status": "P",
			"bulletinLastUpdated": "2006-07-20T11:01:58",
			"bulletinTitle": "FN - # 62042 - WS-C3750G-16TD-E/-S: Hardware failure, system reboots, lose network connectivity - Replacement Required",
			"bulletinFirstPublished": "2005-07-18T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62042.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63770,
			"status": "P",
			"bulletinLastUpdated": "2018-10-11T00:00:00",
			"bulletinTitle": "FN63770 - WLC21XX, WLC44XX, WiSM Might Fail to Boot Up After a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63770.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70208,
			"status": "P",
			"bulletinLastUpdated": "2018-06-19T00:00:00",
			"bulletinTitle": "FN70208 - Aironet 1560, 2800, and 3800 Series Access Points Fail to Pass Traffic - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-05-29T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70208.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70330,
			"status": "P",
			"bulletinLastUpdated": "2019-01-28T00:00:00",
			"bulletinTitle": "FN70330 - Cisco IOS Access Point Stranded Due to Flash Corruption Issue - Workaround Provided",
			"bulletinFirstPublished": "2018-12-20T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70330.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 62570,
			"status": "P",
			"bulletinLastUpdated": "2008-03-11T15:29:03",
			"bulletinTitle": "FN # 62570, WS-C3750G-48TS-E, WS-C3750G-48TS-S Printed Circuit Assembly Defect, HW Replacement Required",
			"bulletinFirstPublished": "2007-03-15T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62570.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63251,
			"status": "P",
			"bulletinLastUpdated": "2017-10-11T00:00:00",
			"bulletinTitle": "FN63251 - Cisco Catalyst 3560V2 and 3750V2 Series Switches Have Redundant Power Supply Covers of Incorrect Size - Replace on Failure ",
			"bulletinFirstPublished": "2010-12-17T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/632/fn63251.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62787,
			"status": "P",
			"bulletinLastUpdated": "2008-06-30T16:28:35",
			"bulletinTitle": "FN# 62787 - Safety Notice - Potential Manufacturing Issue on Switches and Redundant Power Supplies",
			"bulletinFirstPublished": "2007-04-23T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62787.html",
			"fieldNoticeType": "O"
	},
	{
			"fieldNoticeId": 10951,
			"status": "P",
			"bulletinLastUpdated": "2005-11-17T12:27:05",
			"bulletinTitle": "*Expired*  FN# 10951 SX GBIC fails on initial link or drops link while in service",
			"bulletinFirstPublished": "2019-06-07T19:54:15",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn10951.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64175,
			"status": "P",
			"bulletinLastUpdated": "2017-10-12T00:00:00",
			"bulletinTitle": "FN64175 - Catalyst 2960X and 6800IA Units Might Display Error on HW Authenticity or Uplink Ports Might Fail Intermittently - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-08-09T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64175.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63763,
			"status": "P",
			"bulletinLastUpdated": "2018-09-10T00:00:00",
			"bulletinTitle": "FN63763 - AP1250, AP1140, AP1520, and AP1130 Might Fail to Boot Up after a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63763.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64065,
			"status": "P",
			"bulletinLastUpdated": "2019-01-14T00:00:00",
			"bulletinTitle": "FN64065 - Catalyst 3850 Switches Might Falsely Log Power Device Connect/Disconnect Messages - Workaround Provided",
			"bulletinFirstPublished": "2015-10-26T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/640/fn64065.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62403,
			"status": "P",
			"bulletinLastUpdated": "2007-08-28T15:11:46",
			"bulletinTitle": "FN#62403 - Compact Flash Change in Some ASA Platforms",
			"bulletinFirstPublished": "2006-07-18T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62403.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70359,
			"status": "P",
			"bulletinLastUpdated": "2019-01-24T00:00:00",
			"bulletinTitle": "FN70359 - C3650/C3850 and C9300/C9500 Devices That Run on Cisco IOS XE 16.3.5, 16.6.1, or 16.6.2 Might Observe a Memory Leak - Software Upgrade Recommended",
			"bulletinFirstPublished": "2019-01-23T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70359.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64191,
			"status": "P",
			"bulletinLastUpdated": "2019-01-22T00:00:00",
			"bulletinTitle": "FN64191 - Catalyst 3850 and Catalyst 3650 switches running 3.6.5E/3.7.4E or lower versions may exhibit high CPU usage - Workaround Provided",
			"bulletinFirstPublished": "2016-08-29T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01123&pyShowFullPortal=false",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70319,
			"status": "P",
			"bulletinLastUpdated": "2018-11-15T00:00:00",
			"bulletinTitle": "FN70319 - ASA and FXOS Software - Change in Root Certificate Might  Affect Smart Licensing and Smart Call Home Functionality - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-11-07T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70319.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63476,
			"status": "P",
			"bulletinLastUpdated": "2018-05-30T00:00:00",
			"bulletinTitle": "FN63476 - Certain Catalyst 3560G and 3750G Switches Do Not Support Some Older IOS Versions - Software Upgrade Recommended",
			"bulletinFirstPublished": "2011-12-12T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/634/fn63476.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63352,
			"status": "P",
			"bulletinLastUpdated": "2017-10-11T00:00:00",
			"bulletinTitle": "FN63352 - Some Catalyst 3750 Ethernet Switches Might Experience Reduced Operating Lifetime - Replace on Failure",
			"bulletinFirstPublished": "2010-08-26T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00160&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63718,
			"status": "P",
			"bulletinLastUpdated": "2019-01-31T00:00:00",
			"bulletinTitle": "FN63718 - Catalyst 3560X, 3750X, 3850 Switches and XPS-2200 Early Field Failures - Replace on Failure",
			"bulletinFirstPublished": "2014-02-19T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01199&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 29412,
			"status": "P",
			"bulletinLastUpdated": "2005-11-01T15:18:21",
			"bulletinTitle": "Configuration Not Cleared From Manufacturing On Spares Catalyst WS-X4013+= and WS-X4515=",
			"bulletinFirstPublished": "2004-03-31T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/200/fn29412.html",
			"fieldNoticeType": "O"
	},
	{
			"fieldNoticeId": 62537,
			"status": "P",
			"bulletinLastUpdated": "2007-10-02T13:30:04",
			"bulletinTitle": "\"EXPIRED\"  FN - # 62537  Loose latch on some of the GLC-SX-MM.  Customer can request replacement units.",
			"bulletinFirstPublished": "2006-10-11T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62537.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62541,
			"status": "P",
			"bulletinLastUpdated": "2008-12-15T13:51:20",
			"bulletinTitle": "FN 62541 - PWR-2811-AC-IP power supply failure - RMA Required",
			"bulletinFirstPublished": "2019-06-20T06:22:12",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62541.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70320,
			"status": "P",
			"bulletinLastUpdated": "2019-01-18T00:00:00",
			"bulletinTitle": "FN70320 - Nexus 3000, 3500, and 9000 BIOS Upgrade Might Fail at Install - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-11-12T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70320.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63295,
			"status": "P",
			"bulletinLastUpdated": "2019-01-25T00:00:00",
			"bulletinTitle": "FN63295 - Heat Sink Clip on Firewall, Network Analysis, Anomaly Guard, Anomaly Detector, and Intrusion Detection System Service Modules May Be Loose and May Cause the Heat Sink to Function Improperly - Replace on Failure",
			"bulletinFirstPublished": "2010-06-28T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01159&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62544,
			"status": "P",
			"bulletinLastUpdated": "2019-01-25T00:00:00",
			"bulletinTitle": "FN62544 - 2811 Fan Failures - Replace on Failure",
			"bulletinFirstPublished": "2006-10-31T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01156&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70249,
			"status": "P",
			"bulletinLastUpdated": "2018-07-16T00:00:00",
			"bulletinTitle": "FN70249 - WAAS Devices That Run on Version 6.2.3e (Build 43) Do Not Interoperate with Other WAAS Versions - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-07-16T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70249.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64168,
			"status": "P",
			"bulletinLastUpdated": "2016-08-26T08:04:54",
			"bulletinTitle": "FN#64168 ISR4400, incorrect POE Module PID displayed in 'show inventory' command.   Verify correct POE Module PID for RMA's.",
			"bulletinFirstPublished": "2016-08-25T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn64168.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70223,
			"status": "P",
			"bulletinLastUpdated": "2018-06-28T00:00:00",
			"bulletinTitle": "FN70223 - ROMMON Downgraded to a Version Earlier Than 16.2(1r) on ASR1001-X Routers with System Version V04 or Later Causes a ROMMON media drive bootflash: not present Error - Workaround Provided",
			"bulletinFirstPublished": "2018-06-28T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70223.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64005,
			"status": "P",
			"bulletinLastUpdated": "2019-01-22T00:00:00",
			"bulletinTitle": "FN64005 - ISR44xx & ISR43xx- System reboot or memory errors due to DIMM connector - Replace on Failure",
			"bulletinFirstPublished": "2015-09-04T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01130&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70252,
			"status": "P",
			"bulletinLastUpdated": "2018-09-24T00:00:00",
			"bulletinTitle": "FN70252 - Inaccurate \"CDP-4-DUPLEX_MISMATCH\" Messages Are Logged on AP Switchports - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-07-31T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70252.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64069,
			"status": "P",
			"bulletinLastUpdated": "2016-02-09T16:16:25",
			"bulletinTitle": "FN - 64069 - ASA 5506, 5506W, 5506H, 5508, and 5516 Security Appliances Shipped Without ASDM Management Software - Software Upgrade Might Be Required",
			"bulletinFirstPublished": "2016-02-09T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/640/fn64069.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63722,
			"status": "P",
			"bulletinLastUpdated": "2019-02-04T00:00:00",
			"bulletinTitle": "FN63722 - Protective Boot on Certain Network Cables Might Push the Mode Button and Cause an Unexpected Reset on the 48-Port Models of Cisco Catalyst 3560X and 3750X Series Switches - Workaround Provided",
			"bulletinFirstPublished": "2014-01-21T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63722.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64134,
			"status": "P",
			"bulletinLastUpdated": "2019-01-22T00:00:00",
			"bulletinTitle": "FN64134 - Interoperability issue on certain WS-C2960X switches over 10MB link when connected to the specific 3rd party devices - Replace on Failure",
			"bulletinFirstPublished": "2016-06-06T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01132&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63340,
			"status": "P",
			"bulletinLastUpdated": "2017-10-12T00:00:00",
			"bulletinTitle": "FN63340 - WS-C2960S-48FPS-L, WS-C2960S-48FPD-L Power Supply Defect - Replace on Failure ",
			"bulletinFirstPublished": "2010-07-21T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/633/fn63340.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63744,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63744 - Cat2K Might Fail to Boot After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63744.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70110,
			"status": "P",
			"bulletinLastUpdated": "2018-02-07T00:00:00",
			"bulletinTitle": "FN70110 - Memory Leak Issue on C3850/C3650 Switches That Run Polaris Software Version 16.3.3 or Earlier - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-02-06T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/701/fn70110.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63414,
			"status": "P",
			"bulletinLastUpdated": "2019-01-29T00:00:00",
			"bulletinTitle": "FN63414 - C3KX-SM-10G Service Module Does Not Work with Some WS-C3560X and WS-C3750X Switches - Replace on Failure",
			"bulletinFirstPublished": "2011-10-25T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01184&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63745,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63745 - Cat3K Might Fail to Boot After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63745.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70067,
			"status": "P",
			"bulletinLastUpdated": "2017-11-10T00:00:00",
			"bulletinTitle": "FN70067 - cBR-8 - Potential Supervisor Card Crash When IPv6 Related Features are Executed - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-11-10T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/700/fn70067.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 24014,
			"status": "P",
			"bulletinLastUpdated": "2008-04-10T14:59:22",
			"bulletinTitle": "WS-X4515 Sup IV k2 Diag Image in Boot Flash",
			"bulletinFirstPublished": "2019-05-31T22:52:18",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn24014.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63301,
			"status": "P",
			"bulletinLastUpdated": "2019-03-04T00:00:00",
			"bulletinTitle": "FN63301 - CRS: Certain 8-10GBE boards may have fuse reliability issue which can degrade over time - Replace on Failure",
			"bulletinFirstPublished": "2010-08-02T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/633/fn63301.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63863,
			"status": "P",
			"bulletinLastUpdated": "2019-02-04T00:00:00",
			"bulletinTitle": "FN63863 - CRS Line Cards may fail during run time and after a software upgrade or power-cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-09-08T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01219&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62380,
			"status": "P",
			"bulletinLastUpdated": "2007-04-23T10:46:30",
			"bulletinTitle": "FN# 62380 CRS: CRS-8 RPs intermittently encounter Multiple Bit Errors during RP Failover conditions. RMA for Fix.",
			"bulletinFirstPublished": "2019-06-13T06:22:39",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62380.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62140,
			"status": "P",
			"bulletinLastUpdated": "2006-11-22T12:59:02",
			"bulletinTitle": "FN 62140 - LCV PCV Errors on VWIC-xMFT - Troubleshooting Required",
			"bulletinFirstPublished": "2005-11-23T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62140.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63153,
			"status": "P",
			"bulletinLastUpdated": "2008-10-30T13:45:26",
			"bulletinTitle": "FN 63153 : Cisco 38XX Router may fail to boot due to change in ROMmon erase time",
			"bulletinFirstPublished": "2008-08-19T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/631/fn63153.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62606,
			"status": "P",
			"bulletinLastUpdated": "2006-12-13T18:15:28",
			"bulletinTitle": "FN# 62606 - Catalyst 6000 Active Supervisor Engine 720 crashes due to an EOBC Jam created by the Online Insertion of a second Supervisor Engine 720 - Software Upgrade required",
			"bulletinFirstPublished": "2006-12-12T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62606.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70312,
			"status": "P",
			"bulletinLastUpdated": "2018-10-17T00:00:00",
			"bulletinTitle": "FN70312 - Incorrect IBC components may lead to power loss on C9400 products intermittently or permanently - Replace on Failure",
			"bulletinFirstPublished": "2018-10-17T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01038&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64233,
			"status": "P",
			"bulletinLastUpdated": "2017-10-11T00:00:00",
			"bulletinTitle": "FN64233 - Nexus 3000 Series Switches That Run Release 6.0.(2)U6(x) Fail to Upgrade to Release 7.0.(x) with MD5 Sum Mismatch Error - BIOS/Firmware Upgrade Recommended",
			"bulletinFirstPublished": "2016-12-16T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64233.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70016,
			"status": "P",
			"bulletinLastUpdated": "2018-09-26T00:00:00",
			"bulletinTitle": "FN70016 - Nexus 3000/9000 Switch Might Reload Due to Software Issue - BIOS/Firmware Upgrade Recommended",
			"bulletinFirstPublished": "2017-09-26T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/700/fn70016.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64269,
			"status": "P",
			"bulletinLastUpdated": "2017-10-20T00:00:00",
			"bulletinTitle": "FN64269 - Field issue with customers running Akamai Connect on WAAS 6.2.3b version (build #19) - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-03-03T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00476&pyShowFullPortal=false",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70253,
			"status": "P",
			"bulletinLastUpdated": "2018-08-21T00:00:00",
			"bulletinTitle": "FN70253 - Wireless Client Fails to Associate: AID Error - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-08-08T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70253.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64228,
			"status": "P",
			"bulletinLastUpdated": "2017-03-02T22:04:21",
			"bulletinTitle": "FN - 64228 - ASA 5506, ASA 5506W, ASA 5506H, ASA 5508, and ASA 5516 Might Fail After 18 Months or Longer Due to Clock Signal Component FailureReplacement Available for Items Under Warranty or Service Contract",
			"bulletinFirstPublished": "2017-02-02T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64228.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64305,
			"status": "P",
			"bulletinLastUpdated": "2017-06-06T15:50:19",
			"bulletinTitle": "FN - 64305 - Firepower Sensor-Excessive Error Messages Might Overwrite Device Syslog Files-Software Upgrade Required",
			"bulletinFirstPublished": "2017-06-06T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/643/fn64305.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 62344,
			"status": "P",
			"bulletinLastUpdated": "2007-10-09T12:40:47",
			"bulletinTitle": "FN#62344 - C3750G-24/48PS & C3560G-24/48PS Switches May Exhibit Early Life Failures Due to a Suspected Faulty Power Supply, RMA required",
			"bulletinFirstPublished": "2006-08-22T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62344.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63741,
			"status": "P",
			"bulletinLastUpdated": "2018-08-02T00:00:00",
			"bulletinTitle": "FN63741 - ASA 5500 Series Appliances - Some Appliances Might Fail to Boot Up after a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63741.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63585,
			"status": "P",
			"bulletinLastUpdated": "2018-01-08T00:00:00",
			"bulletinTitle": "FN63585 - Catalyst 2960S, 3560V2, 3750V2 Switch Power Supply Failures - Replace on Failure",
			"bulletinFirstPublished": "2012-11-02T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00713&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64190,
			"status": "P",
			"bulletinLastUpdated": "2017-10-16T00:00:00",
			"bulletinTitle": "FN64190 - Cisco IOS XE - Show commands on Cisco IOS XE based platforms might not report true platform memory usage - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-10-07T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64190.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63764,
			"status": "P",
			"bulletinLastUpdated": "2018-09-10T00:00:00",
			"bulletinTitle": "FN63764 - Some ASR1000 Products Might Fail to Boot Up After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63764.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70130,
			"status": "P",
			"bulletinLastUpdated": "2018-04-11T00:00:00",
			"bulletinTitle": "FN70130 - ASR1000 - Power Supply Unit State is Incorrectly Displayed - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-04-11T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/701/fn70130.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 62171,
			"status": "P",
			"bulletinLastUpdated": "2007-09-06T09:56:59",
			"bulletinTitle": "FN# 62171 CRS: Multiple Bit errors occur very infrequently on MSCs and RPs, and can result in the board going offline. RMA when symptoms are validated. ",
			"bulletinFirstPublished": "2006-03-16T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62171.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62710,
			"status": "P",
			"bulletinLastUpdated": "2007-03-15T07:58:36",
			"bulletinTitle": "FN# 62710 CRS-1: Manually Downgrading below the Minimum ROMMON levels will render the boards inoperable. See CRS-1 Software/Firmware Compatibility Matrix for Recommended ROMMON levels.",
			"bulletinFirstPublished": "2007-03-15T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/620/fn62710.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63046,
			"status": "P",
			"bulletinLastUpdated": "2018-06-29T00:00:00",
			"bulletinTitle": "FN63046 - CRS - 1OC768-POS-SR Cards May Experience Bit Error Rate (BER) Incidents Due to Onboard Short - Replace on Failure",
			"bulletinFirstPublished": "2008-04-23T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/630/fn63046.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64296,
			"status": "P",
			"bulletinLastUpdated": "2017-10-20T00:00:00",
			"bulletinTitle": "FN64296 - Carrier Routing System and Nexus 7000 Line Card Transceiver Authentication Error - Replace on Failure ",
			"bulletinFirstPublished": "2017-05-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64296.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62461,
			"status": "P",
			"bulletinLastUpdated": "2007-07-19T09:16:29",
			"bulletinTitle": "FN# 62461 - 2811 resets into rommon with SDRAM ECC Error - RMA Required",
			"bulletinFirstPublished": "2006-07-05T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62461.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70169,
			"status": "P",
			"bulletinLastUpdated": "2018-06-20T00:00:00",
			"bulletinTitle": "FN70169 - Invalid IPv6 Address Created by NX-OS on Cisco MDS 9706 and 9710 Leads to Bootflash and ISSU/D Issues - Workaround Provided",
			"bulletinFirstPublished": "2018-05-09T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/701/fn70169.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64180,
			"status": "P",
			"bulletinLastUpdated": "2017-10-20T00:00:00",
			"bulletinTitle": "FN64180 - Nexus 55xx, 56xx, and 600x Series Switch Platforms SNMPd process restart when process reaches Memory Threshold - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-08-19T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64180.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 28655,
			"status": "P",
			"bulletinLastUpdated": "2008-04-18T15:45:29",
			"bulletinTitle": "*Expired* FN - 28655 - VG224 Chassis Guard - Safety Regulation",
			"bulletinFirstPublished": "2004-01-19T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/200/fn28655.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 24054,
			"status": "P",
			"bulletinLastUpdated": "2005-11-01T11:09:38",
			"bulletinTitle": "FN # 24054 - Interoperability Issue between Mixed Version IP phones, Aironet Access Points, and Line Power Switches",
			"bulletinFirstPublished": "2003-04-07T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/en/US/ts/fn/200/fn24054.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70335,
			"status": "P",
			"bulletinLastUpdated": "2018-12-12T00:00:00",
			"bulletinTitle": "FN70335 - ISR-WAAS-200 Deployed on an ISR-4321 Router with Cisco IOS XE Release 16.7 or Earlier Might Experience High Memory Utilization - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-12-12T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/703/fn70335.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 64131,
			"status": "P",
			"bulletinLastUpdated": "2019-01-17T00:00:00",
			"bulletinTitle": "FN64131 - RSP720 Accelerated Battery Discharge While Unplugged/Powered Off - Replace on Failure",
			"bulletinFirstPublished": "2016-06-08T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64131.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63553,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63553 - C7600 Might Fail to Boot Up after a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/635/fn63553.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64281,
			"status": "P",
			"bulletinLastUpdated": "2017-12-13T00:00:00",
			"bulletinTitle": "FN64281 - ASR1001-X (shipped from November 2016 and later) - Built-in One Gigabit Ethernet ports may not come to \"Link Up\" state with versions of Cisco IOS XE 3.12 or IOS XE 3.13 - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-06-02T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00680&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70143,
			"status": "P",
			"bulletinLastUpdated": "2018-03-27T00:00:00",
			"bulletinTitle": "FN70143 - Some 3802 Wireless Access Points Might Be Unable to Connect to the Wired Network - Hardware Upgrade Required",
			"bulletinFirstPublished": "2018-03-27T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/701/fn70143.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62433,
			"status": "P",
			"bulletinLastUpdated": "2007-07-05T16:00:59",
			"bulletinTitle": "*EXPIRED* FN# 62433 -  PWR-C45-1300ACV - A small number of Power Supplies PWR-C45-1300ACV may have a potential to not come back ON after powering OFF when used in redundant systems",
			"bulletinFirstPublished": "2007-07-05T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62433.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63762,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63762 - EHWIC-3G-XXX, EMV-IPVS-16A, HWIC-3G-XXX, NME-XXX, and SM-XXX Might Fail to Boot After a Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/637/fn63762.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70120,
			"status": "P",
			"bulletinLastUpdated": "2018-02-01T00:00:00",
			"bulletinTitle": "FN70120 - Certain GLC-SX-MMD SFPs Require Replacement due to Potential PCB Dimensional Offset - Hardware Upgrade Available",
			"bulletinFirstPublished": "2018-01-24T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/701/fn70120.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64225,
			"status": "P",
			"bulletinLastUpdated": "2018-08-06T00:00:00",
			"bulletinTitle": "FN64225 - GLC-SX-MM-RGD and GLC-ZX-SM-RGD Modules Might Have Incompatibility Issues with CGS 2520, IE 3010, or IE2000 Switches - Replace on Failure",
			"bulletinFirstPublished": "2016-12-23T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64225.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64101,
			"status": "P",
			"bulletinLastUpdated": "2018-01-08T00:00:00",
			"bulletinTitle": "FN64101 - Catalyst 2960X Full Power 48 Port SKUs may spontaneously reboot - Replace on Failure",
			"bulletinFirstPublished": "2016-03-08T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00712&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64025,
			"status": "P",
			"bulletinLastUpdated": "2017-11-21T00:00:00",
			"bulletinTitle": "FN64025 - Adhere to Hardware Installation Guide - WS-C3560CX and WS-C2960CX - Workaround Provided ",
			"bulletinFirstPublished": "2015-09-21T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/640/fn64025.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64294,
			"status": "P",
			"bulletinLastUpdated": "2017-10-10T00:00:00",
			"bulletinTitle": "FN64294 - ISA3000 Software Security Appliance Might Fail To Pass Traffic After 213 Days Of Uptime - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-04-07T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64294.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70081,
			"status": "P",
			"bulletinLastUpdated": "2017-12-18T00:00:00",
			"bulletinTitle": "FN70081 - ASA Software - ASA 5500-X Security Appliance Might Reboot When It Authenticates the AnyConnect Client - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-12-18T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/700/fn70081.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 61222,
			"status": "P",
			"bulletinLastUpdated": "2005-09-19T20:29:57",
			"bulletinTitle": "Frame errors possible on 10/100/1000 ports receiving malformed preamble at 10Mbps or 100Mbps.",
			"bulletinFirstPublished": "2019-05-31T22:52:20",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn61222.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64151,
			"status": "P",
			"bulletinLastUpdated": "2017-11-18T00:00:00",
			"bulletinTitle": "FN64151 - Cisco Industrial Ethernet 4000 and Industrial Ethernet 5000 Software Deferral - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-06-09T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/641/fn64151.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 17842,
			"status": "P",
			"bulletinLastUpdated": "2006-05-16T15:49:55",
			"bulletinTitle": "**EXPIRED** FN# 17842 Catalyst 4006 Chassis and WS-X4232-GB-RJ Modules With Duplicate MAC Addresses",
			"bulletinFirstPublished": "2005-10-13T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn17842.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64315,
			"status": "P",
			"bulletinLastUpdated": "2017-12-18T00:00:00",
			"bulletinTitle": "FN64315 - ASA Software - Stale VPN Context Entries Cause ASA to Stop Traffic Encryption - Software Upgrade Recommended",
			"bulletinFirstPublished": "2017-07-12T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/643/fn64315.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63697,
			"status": "P",
			"bulletinLastUpdated": "2017-10-12T00:00:00",
			"bulletinTitle": "FN63697 - Protective Boot on Certain Network Cables Might Push the Mode Button and Cause an Unexpected Reset on the 48-Port Models of Cisco Catalyst 3650 and 3850 Series Switches - Workaround Provided ",
			"bulletinFirstPublished": "2013-10-25T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/636/fn63697.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62462,
			"status": "P",
			"bulletinLastUpdated": "2008-03-06T14:45:19",
			"bulletinTitle": "FN# 62462 **DO NOT DISCLOSE** Cat4500 Supervisors (WS-X4013+), (WS-X4014), (WS-X4515) and (WS-X4516) may fail due to issues related to a MOSFET or a combination of two MOSFETs ",
			"bulletinFirstPublished": "2006-09-02T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62462.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63493,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63493 - CRS - Products Affected Might Fail to Boot Up After a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/634/fn63493.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63350,
			"status": "P",
			"bulletinLastUpdated": "2017-10-09T00:00:00",
			"bulletinTitle": "FN63350 - SRE (SM-SRE-700-K9,SM-SRE-00-K9 ) Module may fail due to fan-tray vibration in high temperature environments - Replace on Failure ",
			"bulletinFirstPublished": "2010-08-17T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00028&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62259,
			"status": "P",
			"bulletinLastUpdated": "2005-11-17T14:50:20",
			"bulletinTitle": "FN - 62259 - %CIRRUS-4-DOWNREV_NM message or watchdog timeout with NM-32A, NM-16A, NM-8A/S, NM-4A/S - RMA Required",
			"bulletinFirstPublished": "2005-11-17T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62259.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64211,
			"status": "P",
			"bulletinLastUpdated": "2017-10-12T00:00:00",
			"bulletinTitle": "FN64211 - MDS9K - Traffic Interruption Due To Fibre Channel Interface Link Up/Down Events - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-10-25T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/642/fn64211.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63522,
			"status": "P",
			"bulletinLastUpdated": "2018-08-23T00:00:00",
			"bulletinTitle": "FN63522 - Catalyst 6500/Cisco 7600 Series Router - Firewall Service Module (FWSM) - Some Service Modules Might Fail to Boot Up After a Software Upgrade or Power Cycle - Replace on Failure",
			"bulletinFirstPublished": "2014-03-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/635/fn63522.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 62583,
			"status": "P",
			"bulletinLastUpdated": "2007-07-24T15:13:47",
			"bulletinTitle": "FN# 62583 - WS-SVC-FWM-1-K9 - Incorrect component could cause Firewall Service Module to shut down or reset.   RMA required.",
			"bulletinFirstPublished": "2007-07-24T00:00:00",
			"distributionCode": "I",
			"URL": "http://www-tac.cisco.com/Support_Library/field_alerts/fn62583.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 70082,
			"status": "P",
			"bulletinLastUpdated": "2018-02-21T00:00:00",
			"bulletinTitle": "FN70082 - Nexus 3000 Series Platforms Might Observe an eUSB Failure - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-02-20T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/700/fn70082.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 70288,
			"status": "P",
			"bulletinLastUpdated": "2018-11-05T00:00:00",
			"bulletinTitle": "FN70288 - ISR-WAAS Does Not Deploy Successfully on an ISR-4321 Router Installed with Cisco IOS XE Software Release 16.9.x - Software Upgrade Recommended",
			"bulletinFirstPublished": "2018-09-03T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/702/fn70288.html",
			"fieldNoticeType": "S"
	},
	{
			"fieldNoticeId": 63427,
			"status": "P",
			"bulletinLastUpdated": "2019-01-29T00:00:00",
			"bulletinTitle": "FN63427 - AIR-CT5508 series controllers affected with solid amber alarm light & boot failure issue - Replace on Failure",
			"bulletinFirstPublished": "2011-09-06T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV01182&pyShowFullPortal=false",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 63938,
			"status": "P",
			"bulletinLastUpdated": "2017-10-27T00:00:00",
			"bulletinTitle": "FN63938 - ISR4451X/K9 & ISR4431/K9 - Silent \"PowerON\" Reload - CPLD Update Required - Software Upgrade Recommended",
			"bulletinFirstPublished": "2015-03-20T00:00:00",
			"distributionCode": "E",
			"URL": "http://www.cisco.com/c/en/us/support/docs/field-notices/639/fn63938.html",
			"fieldNoticeType": "H"
	},
	{
			"fieldNoticeId": 64195,
			"status": "P",
			"bulletinLastUpdated": "2017-10-12T00:00:00",
			"bulletinTitle": "FN64195 - Catalyst 3650 switches may report faulty POE ports running IOS-XE 3.6.5E - Software Upgrade Recommended",
			"bulletinFirstPublished": "2016-08-30T00:00:00",
			"distributionCode": "I",
			"URL": "https://ibpm.cisco.com/gssc/fn/login?pyActivity=Work-.Open&Action=FieldNoticePreview&HarnessPurpose=Review&InsHandle=CISCO-SERVICES-GSLO-FN-WORK RV00234&pyShowFullPortal=false",
			"fieldNoticeType": "S"
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
function MockNotices (
	rows?: number,
	page?: number,
	filter?: number[]): FieldNoticeBulletinResponse {

	let data = _.cloneDeep(mockNoticeResponse);
	const total = data.length;
	let pagination: Pagination;
	if (filter) {
		data = _.filter(data, d => _.find(filter, f => f === d.fieldNoticeId));
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

/** The scenarios */
export const FieldNoticeBulletinScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Field Notice Bulletins',
					response: {
						body: MockNotices(),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 250,
					description: 'Field Notice Bulletins - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
			],
		},
		url: `${api}?sort=bulletinLastUpdated:DESC&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Field Notice Bulletins with id\'s',
					response: {
						body: MockNotices(null, null, [64134, 63718, 63722,
							63352, 63744, 63564, 63251, 63745]),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?fieldNoticeId=64134&fieldNoticeId=63718&fieldNoticeId=63722` +
			'&fieldNoticeId=63352&fieldNoticeId=63744&fieldNoticeId=63564' +
			'&fieldNoticeId=63251&fieldNoticeId=63745',
		usecases: ['Use Case 1'],
	},
];
