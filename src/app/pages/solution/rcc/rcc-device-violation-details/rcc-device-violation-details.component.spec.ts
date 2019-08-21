import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RccDeviceViolationDetailsComponent } from './rcc-device-violation-details.component';
import { RccDeviceViolationDetailsModule } from './rcc-device-violation-details.module';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import {
	RccService, RccUtilService,
} from '@sdp-api';
import { throwError, forkJoin, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
	user,
	Mock,
	AssetScenarios,
} from '@mock';

import { Component, Input, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { map, takeUntil, catchError } from 'rxjs/operators';
/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody(mock: Mock, type: string = 'GET') {
	const active = _.find(mock.scenarios[type], 'selected') || _.head(mock.scenarios[type]);

	return active.response.body;
}

describe('RccDeviceViolationDetailsComponent', () => {
	let component: RccDeviceViolationDetailsComponent;
	let fixture: ComponentFixture<RccDeviceViolationDetailsComponent>;
	let rccTrackService: RccService;
	let rccUtilService: RccUtilService;
	// let policyViolationInfo: any;
	// let queryParamMapObj: object = {};
	let impactedDeviceTableOptions: CuiTableOptions;
	let rccViolationInfoTableOptions: CuiTableOptions;
	// let tableConfig = {
	// 	tableLimit: 10,
	// 	tableOffset: 0,
	// 	totalItems: 5,
	// }
	// let paginationConfig = {
	// 	pageLimit: 10,
	// 	pageNum: 1,
	// 	pagerLimit: 10,
	// 	pageIndex: 0,
	// }
	// let impactedDeviceDetails = [];
	// let tableColumnHeaders = [];
	// let violationsDetailsTableColumnHeaders = [];
	// let selectedViolationData: any;
	// let policyRuleData: any = {};
	// let customerId = "90019449";
	let impactedAssetsCount: any;
	let selectionObj: object = {};
	// let destroy$ = new Subject();
	let impactedAssets = [
		{
		  "deviceId": "NA,FCW2246E0PB,C9300-24P,NA",
		  "hostName": "border_1.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.1",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Z0MU,C9300-24P,NA",
		  "hostName": "border_2.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.2",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,9NW3OP1G1S7,CSR1000V,NA",
		  "hostName": "csr1000v_1.dnaauto.cisco.com",
		  "ipAddress": "10.122.21.7",
		  "productFamily": "Cisco Cloud Services Router 1000V Series",
		  "productModel": "CSR1000V",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,602247, E602247, H602247,C9300-24UX, C9300-24UX, C9300-24UX,NA",
		  "hostName": "Device_6_0_2_247",
		  "ipAddress": "6.0.2.247",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24UX, C9300-24UX, C9300-24UX",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Q0T2,C9300-24P,NA",
		  "hostName": "edge_1.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.4",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FCW2246E0PE,C9300-24P,NA",
		  "hostName": "edge_2.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.5",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Z0MW,C9300-24P,NA",
		  "hostName": "fusion_shared_serv.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.3",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		}
	  ]
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RccDeviceViolationDetailsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({}),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		})
			.compileComponents();

		rccTrackService = TestBed.get(RccService);
		rccUtilService = TestBed.get(RccUtilService);


	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(RccDeviceViolationDetailsComponent);
		component = fixture.componentInstance;
		component.policyViolationInfo = {
			active: true,
			impassets: 7,
			policycategory: "Audit and Management",
			policygroupid: "PCI_IOS_XE_GROUP",
			policyid: "_Terminal_Access__IOSXE_",
			policyname: "Terminal Access [ IOS-XE ]",
			ruleid: "_Check_Login_Authentication_on_terminal_lines__IOSXE_",
			ruleseverity: "P3",
			ruletitle: "Check Login Authentication on terminal lines [ IOS-XE ]",
			violationcount: 7
		}

		component.queryParamMapObj = {
			customerId: "90019449",
			policyCategory: "Audit and Management",
			policyGroup: "PCI_IOS_XE_GROUP",
			policyName: "_Terminal_Access__IOSXE_",
			ruleName: "_Check_Login_Authentication_on_terminal_lines__IOSXE_",
			severity: "P3"
		}
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should invoke onPageIndexChange method', () => {
		component.onPageIndexChange({page:1});
		fixture.detectChanges();
	});

	it('Should invoke ngOnInit method which initializes both table options', () => {
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.rccViolationInfoTableOptions)
			.toBeDefined();
		expect(component.impactedDeviceTableOptions)
			.toBeDefined();


	});

	it('Should invoke the api to get data on selection dropdown change', () => {
		component.selectionObj = {'productModel':'C9300-24P','osName':'IOSXE'};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
		.and
		.returnValue(of({ "status": 200, "message": "SUCCESS", "data": { "customerId": "90019449", "impactedAssetsCount": 7, "impactedAssets": [{ "deviceId": "NA,FCW2246E0PB,C9300-24P,NA", "hostName": "border_1.dnaauto.cisco.com", "ipAddress": "172.16.0.1", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MU,C9300-24P,NA", "hostName": "border_2.dnaauto.cisco.com", "ipAddress": "172.16.0.2", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,9NW3OP1G1S7,CSR1000V,NA", "hostName": "csr1000v_1.dnaauto.cisco.com", "ipAddress": "10.122.21.7", "productFamily": "Cisco Cloud Services Router 1000V Series", "productModel": "CSR1000V", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,602247, E602247, H602247,C9300-24UX, C9300-24UX, C9300-24UX,NA", "hostName": "Device_6_0_2_247", "ipAddress": "6.0.2.247", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24UX, C9300-24UX, C9300-24UX", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Q0T2,C9300-24P,NA", "hostName": "edge_1.dnaauto.cisco.com", "ipAddress": "172.16.0.4", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FCW2246E0PE,C9300-24P,NA", "hostName": "edge_2.dnaauto.cisco.com", "ipAddress": "172.16.0.5", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MW,C9300-24P,NA", "hostName": "fusion_shared_serv.dnaauto.cisco.com", "ipAddress": "172.16.0.3", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }] }, "error": null }));

		component.onSelection({});
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
			.toBeDefined();

		expect(component.impactedDeviceDetails).toEqual(impactedAssets)

	});
	it('Should invoke api and error response should keep impactedDeviceDetails empty array', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		component.selectionObj = {'productModel':'C9300-24P','osName':'IOSXE'};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		component.onSelection({});
		fixture.detectChanges();
		expect(component.impactedDeviceDetails)
		.toEqual([]);
	});


	it('Should check if the selectionObj is with empty value then do not add them to query params', () => {
		component.selectionObj = {'productModel':'','osName':null};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
		.and
		.returnValue(of({ "status": 200, "message": "SUCCESS", "data": { "customerId": "90019449", "impactedAssetsCount": 7, "impactedAssets": [{ "deviceId": "NA,FCW2246E0PB,C9300-24P,NA", "hostName": "border_1.dnaauto.cisco.com", "ipAddress": "172.16.0.1", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MU,C9300-24P,NA", "hostName": "border_2.dnaauto.cisco.com", "ipAddress": "172.16.0.2", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,9NW3OP1G1S7,CSR1000V,NA", "hostName": "csr1000v_1.dnaauto.cisco.com", "ipAddress": "10.122.21.7", "productFamily": "Cisco Cloud Services Router 1000V Series", "productModel": "CSR1000V", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,602247, E602247, H602247,C9300-24UX, C9300-24UX, C9300-24UX,NA", "hostName": "Device_6_0_2_247", "ipAddress": "6.0.2.247", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24UX, C9300-24UX, C9300-24UX", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Q0T2,C9300-24P,NA", "hostName": "edge_1.dnaauto.cisco.com", "ipAddress": "172.16.0.4", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FCW2246E0PE,C9300-24P,NA", "hostName": "edge_2.dnaauto.cisco.com", "ipAddress": "172.16.0.5", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MW,C9300-24P,NA", "hostName": "fusion_shared_serv.dnaauto.cisco.com", "ipAddress": "172.16.0.3", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }] }, "error": null }));

		component.onSelection({});
		fixture.detectChanges();
		expect(component.impactedDeviceDetails).toEqual(impactedAssets)
	});

	it('Should get the api data on ngonchanges method', done => {
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(of({ "status": 200, "message": "SUCCESS", "data": { "customerId": "90019449", "impactedAssetsCount": 7, "impactedAssets": [{ "deviceId": "NA,FCW2246E0PB,C9300-24P,NA", "hostName": "border_1.dnaauto.cisco.com", "ipAddress": "172.16.0.1", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MU,C9300-24P,NA", "hostName": "border_2.dnaauto.cisco.com", "ipAddress": "172.16.0.2", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,9NW3OP1G1S7,CSR1000V,NA", "hostName": "csr1000v_1.dnaauto.cisco.com", "ipAddress": "10.122.21.7", "productFamily": "Cisco Cloud Services Router 1000V Series", "productModel": "CSR1000V", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,602247, E602247, H602247,C9300-24UX, C9300-24UX, C9300-24UX,NA", "hostName": "Device_6_0_2_247", "ipAddress": "6.0.2.247", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24UX, C9300-24UX, C9300-24UX", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Q0T2,C9300-24P,NA", "hostName": "edge_1.dnaauto.cisco.com", "ipAddress": "172.16.0.4", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FCW2246E0PE,C9300-24P,NA", "hostName": "edge_2.dnaauto.cisco.com", "ipAddress": "172.16.0.5", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }, { "deviceId": "NA,FOC2246Z0MW,C9300-24P,NA", "hostName": "fusion_shared_serv.dnaauto.cisco.com", "ipAddress": "172.16.0.3", "productFamily": "Cisco Catalyst 9300 Series Switches", "productModel": "C9300-24P", "osName": "IOSXE", "osVersion": "swVersion", "violationCount": 1, "violations": [{ "message": "AAA authentication login method configured to ask Username/Password.", "suggestedfix": "", "age": 0, "severity": "P3" }] }] }, "error": null }));

		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(
				{ "status": 200, "message": "SUCCESS", "data": { "deviceFilterDetails": { "productFamily": ["Cisco Catalyst 9300 Series Switches", "Cisco Cloud Services Router 1000V Series"], "productModel": ["C9300-24P", "C9300-24UX, C9300-24UX, C9300-24UX", "CSR1000V"], "osName": ["IOSXE"] }, "customerId": "90019449", "rule": { "name": "All authentication methods should ask Username And Password [ IOS-XE ]", "desc": "It is always important to choose the right order for the methods on a method list for 'AAA authentication'. For AAA login authentication, the first method on the list determines whether the user will be prompted for a username. Methods requiring only a password (e.g. the line method) should never be placed ahead of methods requiring a both username and password, because the user will never be prompted for a username and the mechanism will always fail.", "recommendedAction": "Re-arrange the order of aaa authentication methods so that enable and line are always at the end in the command: \n<br><br>\naaa authentication login \n<br>", "ruleId": "_All_authentication_methods_should_ask_Username_And_Password__IOSXE_" }, "policy": { "desc": "By using AAA along with security server, you can control access to routers and other network services from a centralized location. This allows for easier management of user accounts and privileges and provides additional capabilities for auditing of network service usage. Login authentication specifies a series of authentication methods that are used to determine whether a user can access network device.", "group": "PCI_IOS_XE_GROUP", "name": "AAA Authentication - Login [ IOS-XE ]", "category": "AAA Services", "policyId": "_AAA_Authentication__Login__IOSXE_" } }, "error": null }));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.impactedAssetsCount)
			.toBeDefined();
		expect(component.selectionObj)
			.toBeDefined();
		done();
	});
	it('Should not get the api data on ngonchanges when there is error in response', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccTrackService, 'getRccViolationDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(rccTrackService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnChanges();
		fixture.detectChanges();
		done();
	});

	it('Should get the api data ngonchanges empty info data', () => {
		component.policyViolationInfo = {};
		component.ngOnChanges();
		fixture.detectChanges();

	});

});
