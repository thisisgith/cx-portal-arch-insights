import { configureTestSuite } from 'ng-bullet';
import * as enUSJson from 'src/assets/i18n/en-US.json';
import { async, tick, ComponentFixture, TestBed, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle.component';
import { LifecycleModule } from './lifecycle.module';
import {
	RacetrackService,
	RacetrackContentService,
	GenericApiControllerService,
	AtxSchema,
	SuccessPathsResponse,
	AtxSessionSchema,
} from '@sdp-api';
import {
	RacetrackScenarios,
	ATXScenarios,
	ACCScenarios,
	BookmarkScenarios,
	ELearningScenarios,
	SuccessPathScenarios,
	ActionScenarios,
	Mock,
	user,
	CancelATXScenarios,
	RegisterATXScenarios,
	PartnerInfoScenarios,
} from '@mock';
import { of, throwError, Observable } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RacetrackInfoService } from '@services';
import { AppService } from 'src/app/app.service';
import { I18n } from '@cisco-ngx/cui-utils';
import { delay } from 'rxjs/operators';

/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody (mock: Mock, type: string = 'GET') {
	const active = _.find(mock.scenarios[type], 'selected') || _.head(mock.scenarios[type]);

	return active.response.body;
}

describe('LifecycleComponent', () => {
	let component: LifecycleComponent;
	let fixture: ComponentFixture<LifecycleComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let racetrackService: RacetrackService;
	let racetrackContentService: RacetrackContentService;
	let racetrackInfoService: RacetrackInfoService;
	let partnerService: GenericApiControllerService;

	let racetrackATXSpy;
	let racetrackAccSpy;
	let racetrackBookmarkSpy;
	// TODO Skip these tests as we are disbaling CGT
	// Enable them when CGT is enabled
	// let racetrackCgtCompletedTrainigsSpy;
	// let racetrackCgtCustomerQuotaSpy;
	let racetrackLearningSpy;
	let racetrackInfoSpy;
	let racetrackSPSpy: jasmine.Spy<(params: RacetrackContentService.GetRacetrackSuccessPathsParams)
		=> Observable<SuccessPathsResponse>>;
	let racetrackActionSpy;
	let racetrackCancelAtxSessionSpy;
	let racetrackRegisterAtxSessionSpy;
	let partnerSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(racetrackATXSpy, 'restore');
		_.invoke(racetrackInfoSpy, 'restore');
		_.invoke(racetrackAccSpy, 'restore');
		_.invoke(racetrackBookmarkSpy, 'restore');
		// TODO Skip these tests as we are disbaling CGT
		// Enable them when CGT is enabled
		// _.invoke(racetrackCgtCompletedTrainigsSpy, 'restore');
		// _.invoke(racetrackCgtCustomerQuotaSpy, 'restore');
		_.invoke(racetrackLearningSpy, 'restore');
		_.invoke(racetrackSPSpy, 'restore');
		_.invoke(racetrackActionSpy, 'restore');
		_.invoke(racetrackCancelAtxSessionSpy, 'restore');
		_.invoke(racetrackRegisterAtxSessionSpy, 'restore');
		_.invoke(partnerSpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		racetrackATXSpy = spyOn(racetrackContentService, 'getRacetrackATX')
			.and
			.callFake(args => {
				if (args.pitstop === 'Implement') {
					return of(getActiveBody(ATXScenarios[1]));
				}
				if (args.pitstop === 'Use') {
					return of(getActiveBody(ATXScenarios[2]));
				}
				if (!args.providerId) {
					return of(getActiveBody(ATXScenarios[9]));
				}

				return of(getActiveBody(ATXScenarios[0]));
			});

		racetrackAccSpy = spyOn(racetrackContentService, 'getRacetrackACC')
			.and
			.returnValue(of(getActiveBody(ACCScenarios[0])));

		racetrackBookmarkSpy = spyOn(racetrackContentService, 'updateBookmark')
			.and
			.returnValue(of(getActiveBody(BookmarkScenarios[0], 'POST')));

		racetrackCancelAtxSessionSpy = spyOn(racetrackContentService, 'cancelSessionATX')
			.and
			.returnValue(of(getActiveBody(CancelATXScenarios[0], 'DELETE')));

		racetrackRegisterAtxSessionSpy = spyOn(racetrackContentService, 'registerUserToAtx')
			.and
			.returnValue(of(getActiveBody(RegisterATXScenarios[0], 'POST')));

		// TODO Skip these tests as we are disbaling CGT
		// Enable them when CGT is enabled
		// racetrackCgtCompletedTrainigsSpy =
		// spyOn(racetrackContentService, 'getCompletedTrainings').and
		// 	.returnValue(of(getActiveBody(CGTScenarios[2])));

		// racetrackCgtCustomerQuotaSpy = spyOn(racetrackContentService, 'getTrainingQuotas')
		// 	.and
		// 	.returnValue(of(getActiveBody(CGTScenarios[1])));

		racetrackLearningSpy = spyOn(racetrackContentService, 'getRacetrackElearning')
			.and
			.returnValue(of(getActiveBody(ELearningScenarios[0])));

		racetrackSPSpy = spyOn(racetrackContentService, 'getRacetrackSuccessPaths')
			.and
			.callFake(args => {
				if (!args.pitstop) {
					return of(getActiveBody(SuccessPathScenarios[10]));
				}

				return of(getActiveBody(SuccessPathScenarios[0]));
			});

		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(of(getActiveBody(RacetrackScenarios[0])));

		racetrackActionSpy = spyOn(racetrackService, 'updatePitstopAction')
			.and
			.returnValue(of(getActiveBody(ActionScenarios[0], 'PUT')));

		partnerSpy = spyOn(partnerService, 'getPartnerListUsingGET')
			.and
			.returnValue(of(getActiveBody(PartnerInfoScenarios[0])));
	};

	/**
	 * Sends the current solution and use case via subscriptions
	 */
	const sendParams = () => {
		const racetrack = getActiveBody(RacetrackScenarios[0]);

		racetrackInfoService.sendCurrentSolution(racetrack.solutions[0]);

		racetrackInfoService.sendCurrentTechnology(racetrack.solutions[0].technologies[0]);
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				LifecycleModule,
			],
			providers: [
				AppService,
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {

		racetrackInfoService = TestBed.get(RacetrackInfoService);
		racetrackService = TestBed.get(RacetrackService);
		racetrackContentService = TestBed.get(RacetrackContentService);
		partnerService = TestBed.get(GenericApiControllerService);
	}));

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);
		fixture = TestBed.createComponent(LifecycleComponent);
		component = fixture.componentInstance;
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should get partner list', () => {
		buildSpies();
		sendParams();

		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.partnerList.length)
					.toEqual(7);
			});
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select view', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			component.selectView('list', 'SB');
			fixture.detectChanges();
			expect(component.sbview)
				.toBe('list');

			component.selectView('grid', 'SB');
			fixture.detectChanges();
			expect(component.sbview)
				.toBe('grid');

			component.selectView('list', 'ACC');
			fixture.detectChanges();
			expect(component.accview)
				.toBe('list');

			component.selectView('grid', 'ACC');
			fixture.detectChanges();
			expect(component.accview)
				.toBe('grid');

			component.selectView('list', 'ATX');
			fixture.detectChanges();
			expect(component.atxview)
				.toBe('list');

			component.selectView('grid', 'ATX');
			fixture.detectChanges();
			expect(component.atxview)
				.toBe('grid');

			component.selectView('grid', 'PG');
			fixture.detectChanges();
			expect(component.pgview)
				.toBe('grid');

			component.selectView('list', 'PG');
			fixture.detectChanges();
			expect(component.pgview)
				.toBe('list');

			done();
		});
	});

	it('should correctly get the height of the app-header', () => {
		// Test to make sure that the calculations work correctly when there is no
		// app-header element.
		expect(component.appHeaderHeight)
			.toBe(0);
		expect(component.appHeaderHeightPX)
			.toBe('0');

		// Create a dummy app-header element for the component to find.
		const expectedAppHeaderHeight = 50;
		const expectedAppHeaderHeightPX = `${expectedAppHeaderHeight}px`;
		const appHeader = document.createElement('app-header');
		appHeader.style.display = 'block';
		appHeader.style.height = expectedAppHeaderHeightPX;
		document.body.append(appHeader);
		component.ngOnInit();

		fixture.detectChanges();

		expect(component.appHeaderHeight)
			.toBe(expectedAppHeaderHeight);
		expect(component.appHeaderHeightPX)
			.toBe(expectedAppHeaderHeightPX);
	});

	describe('ATX', () => {
		it('should have loaded the atx items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.atx.sessions.length)
						.toEqual(4);
				});
		});

		it('should gracefully handle failures for all other api calls', () => {
			racetrackATXSpy = spyOn(racetrackContentService, 'getRacetrackATX')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackAccSpy = spyOn(racetrackContentService, 'getRacetrackACC')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			// TODO Skip these tests as we are disbaling CGT
			// Enable them when CGT is enabled
			// racetrackCgtCompletedTrainigsSpy = spyOn(racetrackContentService,
			// 	'getCompletedTrainings')
			// 	.and
			// 	.returnValue(throwError(new HttpErrorResponse({
			// 		status: 404,
			// 		statusText: 'Resource not found',
			// 	})));

			// racetrackCgtCustomerQuotaSpy = spyOn(racetrackContentService, 'getTrainingQuotas')
			// 	.and
			// 	.returnValue(throwError(new HttpErrorResponse({
			// 		status: 404,
			// 		statusText: 'Resource not found',
			// 	})));

			racetrackLearningSpy = spyOn(racetrackContentService, 'getRacetrackElearning')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackSPSpy = spyOn(racetrackContentService, 'getRacetrackSuccessPaths')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackRegisterAtxSessionSpy = spyOn(racetrackContentService, 'registerUserToAtx')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackCancelAtxSessionSpy = spyOn(racetrackContentService, 'cancelSessionATX')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
				.and
				.returnValue(of(getActiveBody(RacetrackScenarios[0])));

			sendParams();

			fixture.detectChanges();

			expect(component.componentData.racetrack)
				.toBeDefined();

			expect(component.componentData.atx)
				.toBeUndefined();

			expect(component.componentData.learning)
				.toBeDefined();

			// Product Guides block
			expect(component.componentData.productGuides.archetypes)
				.toBeUndefined();
			expect(component.componentData.productGuides.items)
				.toBeUndefined();
			expect(component.componentData.productGuides.totalCount)
				.toBeUndefined();
			expect(component.componentData.productGuides.items)
				.toBeUndefined();

			expect(component.componentData.atx)
				.toBeUndefined();

			expect(component.componentData.cgt)
				.toBeUndefined();
		});

		it('should call getPanel function upon clicking viewSessions', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#recommendedATXScheduleButton'));

			expect(de)
				.toBeTruthy();

			el = de.nativeElement;

			spyOn(component, 'getPanel');
			el.click();
			fixture.detectChanges();

			expect(component.getPanel)
				.toHaveBeenCalled();

		});

		it('should have a selected session', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			const recommended = component.componentData.atx.recommended;

			de = fixture.debugElement.query(By.css('#recommendedATXScheduleButton'));

			expect(de)
				.toBeTruthy();

			component.eventXCoordinates = 0;
			(<any> window).innerWidth = 1200;
			let viewAtxSessions: HTMLElement;
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panel)
				.toEqual('panel panel--open');

			component.selectSession(recommended.sessions[0]);

			fixture.detectChanges();

			expect(component.sessionSelected)
				.toEqual(recommended.sessions[0]);

			component.selectSession(recommended.sessions[0]);

			fixture.detectChanges();

			expect(component.sessionSelected)
				.toBeNull();

			const atx1 = component.componentData.atx.sessions[0];
			expect(atx1.status)
				.toEqual('scheduled');
			expect(atx1.sessions[0].scheduled)
				.toBeTruthy();
			component.cancelATXSession(atx1);
			fixture.detectChanges();
			expect(atx1.status)
				.toEqual('recommended');
			expect(atx1.sessions[0].scheduled)
				.toBeFalsy();

			// UI will not force to change the status, will rely on backend
			const session2 = atx1.sessions[0];
			component.registerATXSession(atx1, session2);
			fixture.detectChanges();
			expect(atx1.status)
				.toEqual('recommended');
		});

		it('should show the selected atx sessions in ATX More', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.eventXCoordinates = 0;
			(<any> window).innerWidth = 1200;
			component.atxScheduleCardOpened = true;
			component.moreATXSelected = { };
			let viewAtxSessions: HTMLElement;
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panel)
				.toEqual('panel panel--open');

			component.atxScheduleCardOpened = false;
			component.getMoreCoordinates(viewAtxSessions, 'moreATXList');

			expect(component.moreXCoordinates)
				.toBeGreaterThanOrEqual(0);

			expect(component.moreYCoordinates)
				.toBeGreaterThanOrEqual(0);
		});

		it('closeViewSessions should clear the popupmodal data ', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.eventXCoordinates = 100;
			component.eventYCoordinates = 100;
			component.atxScheduleCardOpened = true;
			component.recommendedAtxScheduleCardOpened = true;
			component.moreXCoordinates = 100;
			component.moreYCoordinates = 100;

			component.closeViewSessions();

			expect(component.eventXCoordinates)
				.toEqual(0);

			expect(component.eventYCoordinates)
				.toEqual(0);

			expect(component.moreXCoordinates)
				.toEqual(0);

			expect(component.moreYCoordinates)
				.toEqual(0);

			expect(component.atxScheduleCardOpened)
				.toBeFalsy();

			expect(component.recommendedAtxScheduleCardOpened)
				.toBeFalsy();

			expect(component.componentData.atx.interested)
				.toBeNull();

			expect(component.moreATXSelected)
				.toBeNull();
		});

		it('atxMoreViewSessions should set data to moreAtxSelected', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.atxScheduleCardOpened = false;
			component.recommendedAtxScheduleCardOpened = true;

			// Test atxMoreViewSessions()
			component.atxMoreViewSessions();

			expect(component.atxScheduleCardOpened)
				.toBeTruthy();

			expect(component.recommendedAtxScheduleCardOpened)
				.toBeFalsy();

			let item: AtxSchema;
			item = { };
			component.atxMoreClicked = false;

			// Test atxMoreSelect()
			component.atxMoreSelect(item, 'moreATXList');

			expect(component.atxMoreClicked)
				.toBeTruthy();

			expect(component.atxScheduleCardOpened)
				.toBeFalsy();

			expect(component.recommendedAtxScheduleCardOpened)
				.toBeFalsy();

			const crossLaunchUrl = 'http://www.cisco.com';
			const crossLaunchUrl1 = 'http://www.cisco.com&solution=IBN&usecase=Campus Network Assurance';
			component.atxMoreClicked = true;

			// Test crossLaunch()
			spyOn(component, 'closeViewSessions');
			spyOn(window, 'open');

			component.crossLaunch(crossLaunchUrl);
			fixture.detectChanges();

			expect(window.open)
				.toHaveBeenCalledWith(crossLaunchUrl1, '_blank');

			// Test getAtxRegisterButton()
			let data: AtxSchema;
			data = {
				status: 'scheduled',
			};
			component.sessionSelected = { };
			component.getLifecycleInfo('Use');

			const button = component.getAtxRegisterButton(data);

			expect(button)
				.toEqual('disabled');

		});

		it('recommendedATXViewSessions should set recommendedAtxScheduleCardOpened to true', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.recommendedAtxScheduleCardOpened = false;

			// Test recommendedATXViewSessions()
			component.recommendedATXViewSessions();

			expect(component.recommendedAtxScheduleCardOpened)
				.toBeTruthy();

			expect(component.atxScheduleCardOpened)
				.toBeFalsy();

			expect(component.atxMoreClicked)
				.toBeFalsy();

		});

		it('should show the atx view-all modal', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('atx');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeTruthy();

			expect(component.componentData.atx.sessions[0].bookmark)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));

			expect(de)
				.toBeTruthy();

			component.updateBookmark(component.componentData.atx.sessions[0], 'ATX');
			fixture.detectChanges();

			expect(component.componentData.atx.sessions[0].bookmark)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('.ribbon__white'));

			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#cardRecommendedATXScheduleButton'));

			expect(de)
				.toBeTruthy();

			const dummyClickedBtn = document.createElement('button');
			component.eventXCoordinates = 200;
			component.eventClickedElement = dummyClickedBtn;
			component.atxview = 'grid';
			(<any> window).innerWidth = 1200;
			let viewAtxSessions: HTMLElement;
			component.componentData.atx.interested = { };
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panel)
				.toEqual('panel cardpanel--open');

			// The function getPanel() initially used eventXCoordinates to identify
			// the panel name, but this code was recently changed and unit tests were not fixed
			// component.atxview = 'grid';
			// component.eventXCoordinates = 1000;
			// component.eventClickedElement = dummyClickedBtn;
			// (<any> window).innerWidth = 1200;
			// component.componentData.atx.interested = { };
			// viewAtxSessions = document.createElement('viewAtxSessions');

			// const panelRight = component.getPanel(viewAtxSessions);

			// fixture.detectChanges();

			// expect(panelRight)
			// 	.toEqual('panel cardpanel--openright');

			component.atxview = 'list';
			component.eventXCoordinates = 1000;
			component.eventClickedElement = dummyClickedBtn;
			(<any> window).innerWidth = 1200;
			component.componentData.atx.interested = { };
			viewAtxSessions = document.createElement('viewAtxSessions');

			const listpanel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(listpanel)
				.toEqual('panel listpanel--open');

			expect(component.getTitle('ATX'))
				.toEqual('Ask the Experts');

			expect(component.getSubtitle('ATX'))
				.toEqual('Interactive webinars available live or on-demand');

			const atx1 = component.componentData.atx.sessions[1];
			expect(atx1.bookmark)
				.toBeFalsy();
			component.updateBookmark(atx1, 'ATX');
			fixture.detectChanges();
			expect(atx1.bookmark)
				.toBeTruthy();

			component.onSort('title', 'asc', 'ATX');
			fixture.detectChanges();
			expect(component.atxTable.columns[1].sortDirection)
				.toEqual('desc');

			component.onSort('title', 'desc', 'ATX');
			fixture.detectChanges();
			expect(component.atxTable.columns[1].sortDirection)
				.toEqual('asc');

			// Test filter here
			const partnerSelection = [
				{
					companyName: 'Symantec',
					companyId: '293531',
				},
				{
					companyName: 'Salesforce',
					companyId: '293533',
				},
			];
			component.partnerMultiFilter(partnerSelection, 'ATX');
			fixture.detectChanges();
			expect(component.selectedPartnerFilterForATX.length)
				.toEqual(2);

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeFalsy();
		});

	});

	describe('ACC', () => {
		it('should have loaded the acc items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.acc.sessions.length)
						.toEqual(5);
				});
		});

		it('should filter Cisco items when CX Level 1', () => {
			component.cxLevel = 1;
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.acc.sessions.length)
						.toEqual(4);
				});

		});

		it('should show the acc view-all modal', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('acc');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeTruthy();

			expect(component.getTitle('ACC'))
			 .toEqual('Accelerator');

			expect(component.getSubtitle('ACC'))
			 .toEqual('1-on-1 coaching to put you in the fast lane');

			de = fixture.debugElement.query(By.css('.ribbon__white'));
			expect(de)
				.toBeTruthy();

			const acc3 = component.componentData.acc.sessions[3];
			component.updateBookmark(acc3, 'ACC');
			fixture.detectChanges();
			expect(component.componentData.acc.sessions[3].bookmark)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.progressbar'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#moreACCList-item'));
			expect(de)
				.toBeTruthy();

			component.updateBookmark(acc3, 'ACC');
			fixture.detectChanges();
			expect(component.componentData.acc.sessions[3].bookmark)
				.toBeFalsy();

			const acc5 = component.componentData.acc.sessions[1];
			expect(acc5.status)
				.toEqual('in-progress');

			component.onSort('title', 'asc', 'ACC');
			fixture.detectChanges();
			expect(component.accTable.columns[1].sortDirection)
				.toEqual('desc');

			component.onSort('title', 'desc', 'ACC');
			fixture.detectChanges();
			expect(component.accTable.columns[1].sortDirection)
				.toEqual('asc');

			// Test filter here
			const partnerSelection = [
				{
					companyName: 'Symantec',
					companyId: '293531',
				},
				{
					companyName: 'Salesforce',
					companyId: '293533',
				},
			];
			component.partnerMultiFilter(partnerSelection, 'ACC');
			fixture.detectChanges();
			expect(component.selectedPartnerFilterForACC.length)
				.toEqual(2);

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeFalsy();
		});
	});

	describe('Success Tips', () => {
		it('should have loaded the successPaths items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.learning.success.length)
						.toEqual(5);
				});
		});

		it('should show the Success Tips view-all modal', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_SuccessTips_');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__white'));
			expect(de)
				.toBeTruthy();

			expect(component.getTitle('SB'))
				.toEqual('Success Tips');

			expect(component.getSubtitle('SB'))
				.toEqual('Resources to fine-tune your tech');

			const sb1 = component.componentData.learning.success[1];
			expect(component.componentData.learning.success[1].bookmark)
				.toBeFalsy();
			component.updateBookmark(sb1, 'SB');
			fixture.detectChanges();
			expect(component.componentData.learning.success[1].bookmark)
				.toBeTruthy();

			component.selectedFilterForSB = 'Project Planning';
			component.selectFilter('SB');
			fixture.detectChanges();
			expect(component.selectedSuccessPaths.length)
				.toEqual(2);

			component.selectedFilterForSB = 'Getting Started';
			component.selectFilter('SB');
			fixture.detectChanges();
			expect(component.selectedSuccessPaths.length)
				.toEqual(1);

			component.selectedFilterForSB = 'Not selected';
			component.selectFilter('SB');
			fixture.detectChanges();
			expect(component.selectedSuccessPaths.length)
				.toEqual(5);

			component.onSort('title', 'asc', 'SB');
			fixture.detectChanges();
			expect(component.successBytesTable.columns[1].sortDirection)
				.toEqual('desc');

			component.onSort('title', 'desc', 'SB');
			fixture.detectChanges();
			expect(component.successBytesTable.columns[1].sortDirection)
				.toEqual('asc');

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeFalsy();
		});

		it('should load Success Tips hover panel', () => {
			buildSpies();
			sendParams();
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.hover-panel--successbytes'));
			expect(de)
				.toBeTruthy();

			// check if there is atleast one icon in the hover block
			de = de.query(By.css('div .type.text-left'))
				.query(By.css('span[class^="icon-"]'));
			expect(de)
				.toBeTruthy();
		});

		it('should set bookmark on clicking the icon in hover panel', () => {
			buildSpies();
			sendParams();
			spyOn(component, 'updateBookmark');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.hover-panel--successbytes .icon-bookmark'));
			de.nativeElement.click();
			expect(component.updateBookmark)
				.toHaveBeenCalledTimes(1);
		});
	});

	describe('Product Guides', () => {
		it('should not load product guides until the modal is open', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			expect(component.componentData.productGuides.items)
				.toBeUndefined();
		});

		it('should load product guides when the modal is open', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');

			fixture.detectChanges();

			expect(component.componentData.productGuides.items.length)
				.toBe(10);
			expect(component.componentData.productGuides.totalCount)
				.toBe(10);
		});

		it('should correctly handle valid sorting', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');
			fixture.detectChanges();

			component.onSort('title', 'asc', 'PG');
			fixture.detectChanges();

			// Ensure that the latest API call was correct.
			let args = racetrackSPSpy
				.calls
				.mostRecent()
				.args
				.shift();
			expect(args.sort0Order)
				.toBe('asc');
			expect(args.sort0Field)
				.toBe('title');

			// Ensure that the table was modified correctly.
			expect(component.productGuidesTable.columns[0].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toBe('desc'); // Bookmark
			expect(component.productGuidesTable.columns[2].sortDirection)
				.toBe('asc'); // Archetype
			expect(component.productGuidesTable.columns[3].sortDirection)
				.toBe('asc'); // Media Type

			// Ensure that new items were not appended like a Load More.
			expect(component.componentData.productGuides.items.length)
				.toBe(10);

			// ------------------------------------------------
			// Try a second sort.

			component.onSort('archetype', 'asc', 'PG');
			fixture.detectChanges();

			// Ensure that the latest API call was correct.
			args = racetrackSPSpy
				.calls
				.mostRecent()
				.args
				.shift();
			expect(args.sort0Order)
				.toBe('asc');
			expect(args.sort0Field)
				.toBe('archetype');

			// Ensure that the table was modified correctly.
			expect(component.productGuidesTable.columns[0].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[2].sortDirection)
				.toBe('desc'); // Archetype
			expect(component.productGuidesTable.columns[3].sortDirection)
				.toBe('asc'); // Media Type

			// Ensure that new items were not appended like a Load More.
			expect(component.componentData.productGuides.items.length)
				.toBe(10);
		});

		it('should correctly handle an invalid sort', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');
			fixture.detectChanges();

			// Do a valid sort.
			component.onSort('archetype', 'asc', 'PG');
			fixture.detectChanges();

			// Ensure that the table was modified correctly.
			expect(component.productGuidesTable.columns[0].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[2].sortDirection)
				.toBe('desc'); // Archetype
			expect(component.productGuidesTable.columns[3].sortDirection)
				.toBe('asc'); // Media Type

			// Force an error response.
			racetrackSPSpy.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				})));

			component.onSort('bookmark', 'asc', 'PG');
			fixture.detectChanges();

			// Ensure that the table was not modified.
			expect(component.productGuidesTable.columns[0].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toBe('asc'); // Bookmark
			expect(component.productGuidesTable.columns[2].sortDirection)
				.toBe('desc'); // Archetype
			expect(component.productGuidesTable.columns[3].sortDirection)
				.toBe('asc'); // Media Type

			// Ensure that sort and filter options have been reset.
			expect(component.componentData.productGuides.sortDirection)
				.toBe('asc');
			expect(component.componentData.productGuides.sort0Field)
				.toBe('title');
			expect(component.componentData.productGuides.filter)
				.toBe('');
		});

		it('should correctly handle filtering', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');
			fixture.detectChanges();

			component.componentData.productGuides.filter = 'Project Planning';
			component.selectFilter('PG');
			fixture.detectChanges();

			// Ensure that new items were not appended like a Load More.
			expect(component.componentData.productGuides.items.length)
				.toBe(10);

			// Force an error response.
			racetrackSPSpy.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				})));

			component.selectFilter('PG');
			fixture.detectChanges();

			// Ensure that sort and filter options have been reset.
			expect(component.componentData.productGuides.sortDirection)
				.toBe('asc');
			expect(component.componentData.productGuides.sort0Field)
				.toBe('title');
			expect(component.componentData.productGuides.filter)
				.toBe('');
		});

		it('should load more content when requested and error out gracefully', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');
			fixture.detectChanges();

			// Button should be disabled with this sample data.
			// We should be at 10/10 cards (100% progress).
			const loadMoreButton = fixture.debugElement
				.query(By.css('.load-more button'));

			expect(component.getSelectedSuccessBytesCount('PG'))
				.toBe('10');
			expect(component.getMaxSuccessBytesCount('PG'))
				.toBe('10');
			expect(component.getSuccessBytesPercentage('PG'))
				.toBe('100'); // 100%
			expect(loadMoreButton)
				.toBeTruthy();
			expect(loadMoreButton.nativeElement.disabled)
				.toBeTruthy();

			// Fool the component in to thinking that there's more.
			component.componentData.productGuides.totalCount = 100;
			component.loadMoreContent('PG');
			fixture.detectChanges();

			expect(component.getSelectedSuccessBytesCount('PG'))
				.toBe('20');
			expect(component.getMaxSuccessBytesCount('PG'))
				.toBe('100');
			expect(component.getSuccessBytesPercentage('PG'))
				.toBe('20'); // 20%
			expect(loadMoreButton)
				.toBeTruthy();
			expect(loadMoreButton.nativeElement.disabled)
				.toBeFalsy();

			// Force an error response.
			racetrackSPSpy.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				})));

			component.loadMoreContent('PG');
			fixture.detectChanges();

			let errorDisplay = fixture.debugElement
				.query(By.css('.load-more .text-danger'));
			expect(component.status.error.productGuides)
				.toBeTruthy();
			expect(errorDisplay)
				.toBeTruthy();

			// Reset the error response.
			// Make another successful call.
			racetrackSPSpy.and
				.returnValue(of(getActiveBody(SuccessPathScenarios[10])));

			component.loadMoreContent('PG');
			fixture.detectChanges();

			// The error display should be gone now.
			expect(component.getSelectedSuccessBytesCount('PG'))
				.toBe('30');
			expect(component.getMaxSuccessBytesCount('PG'))
				.toBe('100');
			expect(component.getSuccessBytesPercentage('PG'))
				.toBe('30'); // 30%
			errorDisplay = fixture.debugElement
				.query(By.css('.load-more .text-danger'));
			expect(component.status.error.productGuides)
				.toBeFalsy();
			expect(errorDisplay)
				.toBeFalsy();

			// Alright, now pretend we're at the last page.
			racetrackSPSpy.calls.reset();
			component.componentData.productGuides.totalCount = 30;
			component.loadMoreContent('PG');
			fixture.detectChanges();

			// The selected count should remain the same.
			expect(racetrackSPSpy)
				.not
				.toHaveBeenCalled();
			expect(component.getSelectedSuccessBytesCount('PG'))
				.toBe('30');
			expect(component.getMaxSuccessBytesCount('PG'))
				.toBe('30');
			expect(component.getSuccessBytesPercentage('PG'))
				.toBe('100'); // 100%
		});

		it('should be able to handle regular usage', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_ProductGuides_');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__white'));
			expect(de)
				.toBeTruthy();

			expect(component.getTitle('PG'))
				.toEqual('Product Documentation and Videos');

			expect(component.getSubtitle('PG'))
				.toEqual('\"How-to\" resources for planning, installation and more');

			const sb1 = component.componentData.productGuides.items[1];
			expect(component.componentData.productGuides.items[1].bookmark)
				.toBeFalsy();
			component.updateBookmark(sb1, 'PG');
			fixture.detectChanges();
			expect(component.componentData.productGuides.items[1].bookmark)
				.toBeTruthy();

			expect(component.componentData.productGuides.items.length)
				.toEqual(10);

			component.componentData.productGuides.filter = 'Project Planning';
			component.selectFilter('PG');
			fixture.detectChanges();
			expect(component.componentData.productGuides.items.length)
				.toEqual(10);

			component.onSort('title', 'asc', 'PG');
			fixture.detectChanges();
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toEqual('desc');

			component.onSort('title', 'desc', 'PG');
			fixture.detectChanges();
			expect(component.productGuidesTable.columns[1].sortDirection)
				.toEqual('asc');

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeFalsy();
		});

		it('should display a spinner when loading data', fakeAsync(() => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			// Force an asynchronous delay of 3 seconds.
			racetrackSPSpy.and
				.returnValue(of(getActiveBody(SuccessPathScenarios[10]))
					.pipe(delay(3000)));

			expect(component.status.loading.productGuides.modal)
				.toBeFalsy();

			component.showModal('_ProductGuides_');
			expect(component.status.loading.productGuides.modal)
				.toBeTruthy();

			tick(3000);

			expect(component.status.loading.productGuides.modal)
				.toBeFalsy();

			// ------------------------------------------------
			// Now test the spinner for load more.

			expect(component.status.loading.productGuides.more)
				.toBeFalsy();

			// Total count must be increased in order for loadMoreContent
			// to work.
			component.componentData.productGuides.totalCount = 100;
			component.loadMoreContent('PG');
			expect(component.status.loading.productGuides.more)
				.toBeTruthy();

			tick(3000);

			expect(component.status.loading.productGuides.more)
				.toBeFalsy();

			discardPeriodicTasks();
		}));
	});

	describe('E-Learning', () => {
		it('should have loaded the elearning items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.learning.elearning.length)
						.toEqual(5);
				});
		});
		it('should have displayed progress bar', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.learning.elearning[0].percentagecompleted)
						.toBeUndefined();
					expect(component.componentData.learning.elearning[1].percentagecompleted)
						.toEqual(25);
					expect(component.componentData.learning.elearning[2].percentagecompleted)
						.toEqual(50);
					expect(component.componentData.learning.elearning[3].percentagecompleted)
						.toEqual(75);
					expect(component.componentData.learning.elearning[4].percentagecompleted)
						.toEqual(100);

					de = fixture.debugElement.query(By.css('.learning-progress-col'));
					expect(de)
						.toBeTruthy();

					de = fixture.debugElement.query(By.css('.learning-progressfill-col'));
					expect(de)
						.toBeTruthy();
				});
		});
	});

	describe('Certifications', () => {
		it('should have loaded the Certifications items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.learning.certifications.length)
						.toEqual(8);
				});
		});
		it('should have displayed progress bar', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.learning.certifications[0].percentagecompleted)
						.toEqual(25);
					expect(component.componentData.learning.certifications[1].percentagecompleted)
						.toEqual(50);
					expect(component.componentData.learning.certifications[2].percentagecompleted)
						.toEqual(75);
					expect(component.componentData.learning.certifications[3].percentagecompleted)
						.toEqual(100);
					expect(component.componentData.learning.certifications[4].percentagecompleted)
						.toEqual(25);
					expect(component.componentData.learning.certifications[5].percentagecompleted)
						.toEqual(50);
					expect(component.componentData.learning.certifications[6].percentagecompleted)
						.toEqual(75);
					expect(component.componentData.learning.certifications[7].percentagecompleted)
						.toEqual(100);
					de = fixture.debugElement.query(By.css('.learning-progress-col'));
					expect(de)
						.toBeTruthy();

					de = fixture.debugElement.query(By.css('.learning-progressfill-col'));
					expect(de)
						.toBeTruthy();
				});
		});
	});

	// Skip these tests as we are disabling CGT
	// TODO enable these when CGT has to be enabled
	xdescribe('CGT', () => {
		it('should have loaded the CGT', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.cgt.sessions.length)
						.toEqual(3);
					expect(component.componentData.cgt.trainingsAvailable)
						.toEqual(1);
				});
		});
	});

	describe('PitstopActions', () => {

		it('should show 25% in the progress label', () => {
			buildSpies();
			sendParams();
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('.comPertText'));
			el = de.nativeElement;
			expect(el.innerHTML)
				.toEqual('25%');
		});

		it('should show action description when click action name', () => {
			buildSpies();
			sendParams();
			fixture.detectChanges();
			component.selectAction(component.currentPitActionsWithStatus[1]);
			fixture.detectChanges();

			expect(component.currentPitActionsWithStatus[1].selected)
				.toBeTruthy();

			// ResetFilter should be shown up
			de = fixture.debugElement.query(By.css('#ResetFilter'));
			expect(de)
				.toBeTruthy();
			el = de.nativeElement;
			el.click();
			expect(component.currentPitActionsWithStatus[1].selected)
				.toBeFalsy();

			spyOn(component, 'hasSelectedAction');

			de = fixture.debugElement.query(By.css('#ResetFilter'));
			expect(de)
				.toBeTruthy();

			// since suggestedAction does not change, so will not trigger ATX API call
			expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalledTimes(1);
		});

		it('should call racetrackService API to update pitstopAction', () => {
			buildSpies();
			sendParams();
			component.completeAction(component.currentPitActionsWithStatus[1].action);
			fixture.detectChanges();

			expect(racetrackService.updatePitstopAction)
				.toHaveBeenCalled();

			// ATX should be refreshed
			expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalled();

		});

		it('should refresh ATX if suggestedAction changes', () => {
			buildSpies();
			sendParams();
			fixture.detectChanges();

			component.selectAction(component.currentPitActionsWithStatus[3]);
			fixture.detectChanges();

			expect(component.currentPitActionsWithStatus[3].selected)
				.toBeTruthy();

			expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalledTimes(2);
		});

		it('should disable ATX Registration if not current or current+1 pitstop', () => {
			buildSpies();
			sendParams();
			// verify that the current pitstop for this solution and use case is "Onboard"
			const currentPitStop = component.currentPitstop.name;
			expect(currentPitStop)
				.toEqual('Onboard');

			// change pitstop to "use" (current+2) and check if button is disabled
			component.getLifecycleInfo('Use');
			component.recommendedAtxScheduleCardOpened = true;
			fixture.detectChanges();

			let data: AtxSchema;
			data = { };
			component.sessionSelected = { };
			const button = component.getAtxRegisterButton(data);

			// expect the button diabled
			expect(button)
				.toEqual('disabled');

			// change pitstop to "implement" (current+1) and check if button is enabled
			component.getLifecycleInfo('Implement');
			component.recommendedAtxScheduleCardOpened = true;
			fixture.detectChanges();
			let data1: AtxSchema;
			data1 = { };
			component.sessionSelected = {
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
				sessionStartDate: 1565127052000,
			};

			const button1 = component.getAtxRegisterButton(data1);

			// expect the button not diabled
			expect(button1)
				.not
				.toEqual('disabled');

			// change pitstop to "Onboard" (current) and check if button is enabled
			racetrackATXSpy.and
				.returnValue(of(getActiveBody(ATXScenarios[7])));

			component.getLifecycleInfo('Onboard');
			component.recommendedAtxScheduleCardOpened = true;
			fixture.detectChanges();
			let data2: AtxSchema;
			data2 = { };
			component.sessionSelected = {
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
				sessionStartDate: 1565127052000,
			};

			const button2 = component.getAtxRegisterButton(data2);

			expect(button2)
				.not
				.toEqual('disabled');
		});

		it('should disable RegButton if registerURL is empty and enable if it is Partner', () => {
			buildSpies();
			sendParams();

			let data: AtxSchema;
			data = { };
			component.sessionSelected = {
				presenterName: 'John Doe',
				registrationURL: '',
				sessionStartDate: 1565127052000,
			};

			let button = component.getAtxRegisterButton(data);

			// expect the button diabled
			expect(button)
				.toEqual('disabled');

			data = {
				providerInfo: {
					id: 'partner1',
					logoURL: '',
					name: 'Symantec',
				},
			};
			button = component.getAtxRegisterButton(data);

			// expect the button not diabled
			expect(button)
			.not
			.toEqual('disabled');
		});

		it('should hide out Cancel Button when scheduled start time is within 24 hours', () => {
			buildSpies();
			sendParams();

			let session: AtxSessionSchema;
			session = {
				presenterName: 'John Doe',
				registrationURL: '',
				sessionStartDate: (new Date().getTime() + 36000000),
			};

			const hide = component.isStartTimeWithin24Hrs(session);

			expect(hide)
			.toBeTruthy();
		});
	});

	// TODO: Introduces flake, needs investigation
	xdescribe('Learn - Non-cypress', () => {

		beforeAll(() => {
			window.Cypress = undefined;
		});

		afterAll(() => {
			window.Cypress = undefined;
			window.elearningLoading = undefined;
			window.successPathsLoading = undefined;
			window.productGuidesLoading = undefined;
		});

		it('Should not set loading flags when loading without Cypress', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			expect(window.Cypress)
				.toBe(undefined);
			expect(window.elearningLoading)
				.toBe(undefined);
			expect(window.successPathsLoading)
				.toBe(undefined);
		});
	});

	// TODO: Introduces flake, needs investigation
	xdescribe('Learn - Cypress', () => {

		beforeAll(() => {
			window.Cypress = 'Bogus Cypress Data';
		});

		afterAll(() => {
			window.Cypress = undefined;
			window.elearningLoading = undefined;
			window.successPathsLoading = undefined;
			window.productGuidesLoading = undefined;
		});

		it('Should set loading flags when loading with Cypress', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			expect(window.Cypress)
				.toEqual('Bogus Cypress Data');
			expect(window.elearningLoading)
				.toBe(false);
			expect(window.successPathsLoading)
				.toBe(false);
			expect(window.productGuidesLoading)
				.toBe(false);
		});
	});
});
