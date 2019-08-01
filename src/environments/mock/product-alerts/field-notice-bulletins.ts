import {
	ProductAlertsPagination as Pagination,
	FieldNoticeBulletinResponse,
	FieldNoticeBulletin,
} from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/field-notice-bulletins';

/** The mock response for coverage counts */
export const MockFieldNoticeBulletins: FieldNoticeBulletin[] = [
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

	let data = _.cloneDeep(MockFieldNoticeBulletins);
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
						body: MockNotices(10, 1),
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
