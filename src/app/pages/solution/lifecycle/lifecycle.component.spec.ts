import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle.component';
import { LifecycleModule } from './lifecycle.module';
import { RacetrackService, RacetrackContentService } from '@sdp-api';
import { SolutionService } from '../solution.service';
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
	CGTScenarios,
} from '@mock';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
	let solutionService: SolutionService;

	let racetrackATXSpy;
	let racetrackAccSpy;
	let racetrackBookmarkSpy;
	let racetrackCgtCompletedTrainigsSpy;
	let racetrackCgtCustomerQuotaSpy;
	let racetrackLearningSpy;
	let racetrackInfoSpy;
	let racetrackSPSpy;
	let racetrackActionSpy;
	let racetrackAccBookmarkSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(racetrackATXSpy, 'restore');
		_.invoke(racetrackInfoSpy, 'restore');
		_.invoke(racetrackAccSpy, 'restore');
		_.invoke(racetrackBookmarkSpy, 'restore');
		_.invoke(racetrackCgtCompletedTrainigsSpy, 'restore');
		_.invoke(racetrackCgtCustomerQuotaSpy, 'restore');
		_.invoke(racetrackLearningSpy, 'restore');
		_.invoke(racetrackSPSpy, 'restore');
		_.invoke(racetrackActionSpy, 'restore');
		_.invoke(racetrackAccBookmarkSpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		racetrackATXSpy = spyOn(racetrackContentService, 'getRacetrackATX')
			.and
			.returnValue(of(getActiveBody(ATXScenarios[0])));

		racetrackAccSpy = spyOn(racetrackContentService, 'getRacetrackACC')
			.and
			.returnValue(of(getActiveBody(ACCScenarios[0])));

		racetrackBookmarkSpy = spyOn(racetrackContentService, 'updateBookmark')
			.and
			.returnValue(of(getActiveBody(BookmarkScenarios[0], 'POST')));

		racetrackCgtCompletedTrainigsSpy = spyOn(racetrackContentService, 'getCompletedTrainings')
			.and
			.returnValue(of(getActiveBody(CGTScenarios[2])));

		racetrackCgtCustomerQuotaSpy = spyOn(racetrackContentService, 'getTrainingQuotas')
			.and
			.returnValue(of(getActiveBody(CGTScenarios[1])));

		racetrackLearningSpy = spyOn(racetrackContentService, 'getRacetrackElearning')
			.and
			.returnValue(of(getActiveBody(ELearningScenarios[0])));

		racetrackSPSpy = spyOn(racetrackContentService, 'getRacetrackSuccessPaths')
			.and
			.returnValue(of(getActiveBody(SuccessPathScenarios[0])));

		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(of(getActiveBody(RacetrackScenarios[0])));

		racetrackActionSpy = spyOn(racetrackService, 'updatePitstopAction')
			.and
			.returnValue(of(getActiveBody(ActionScenarios[0], 'PATCH')));

		racetrackAccBookmarkSpy = spyOn(racetrackContentService, 'updateACCBookmark')
			.and
			.returnValue(of(getActiveBody(ACCScenarios[6], 'POST')));
	};

	/**
	 * Sends the current solution and use case via subscriptions
	 */
	const sendParams = () => {
		const racetrack = getActiveBody(RacetrackScenarios[0]);

		solutionService.sendCurrentSolution(racetrack.solutions[0]);

		solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[0]);
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				LifecycleModule,
			],
			providers: [
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
		})
		.compileComponents();

		solutionService = TestBed.get(SolutionService);
		racetrackService = TestBed.get(RacetrackService);
		racetrackContentService = TestBed.get(RacetrackContentService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LifecycleComponent);
		component = fixture.componentInstance;
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should select view', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.view)
				.toBe('grid');

			component.selectView('list');

			fixture.detectChanges();

			expect(component.view)
				.toBe('list');

			done();
		});
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

			racetrackCgtCompletedTrainigsSpy = spyOn(racetrackContentService,
				'getCompletedTrainings')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

			racetrackCgtCustomerQuotaSpy = spyOn(racetrackContentService, 'getTrainingQuotas')
				.and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));

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

			component.eventCoordinates = 0;
			let viewAtxSessions: HTMLElement;
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panel)
				.toEqual('panel panel--open');

			expect(component.sessionSelected)
				.toBeUndefined();

			component.selectSession(recommended.sessions[0]);

			fixture.detectChanges();

			expect(component.sessionSelected)
				.toEqual(recommended.sessions[0]);

			component.selectSession(recommended.sessions[0]);

			fixture.detectChanges();

			expect(component.sessionSelected)
				.toBeNull();
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

			component.updateBookmark('ATX', component.componentData.atx.sessions[0]);
			fixture.detectChanges();

			expect(component.componentData.atx.sessions[0].bookmark)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('.ribbon__clear'));

			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#ATXScheduleButton'));

			expect(de)
				.toBeTruthy();

			component.eventCoordinates = 200;
			let viewAtxSessions: HTMLElement;
			component.componentData.atx.interested = { };
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panel = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panel)
				.toEqual('panel cardpanel--open');

			component.eventCoordinates = 1000;
			viewAtxSessions = document.createElement('viewAtxSessions');

			const panelRight = component.getPanel(viewAtxSessions);

			fixture.detectChanges();

			expect(panelRight)
				.toEqual('panel cardpanel--openright');

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

			de = fixture.debugElement.query(By.css('.ribbon__green'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__clear'));
			expect(de)
				.toBeTruthy();

			const acc3 = component.componentData.acc.sessions[3];
			component.setFavorite(acc3);
			fixture.detectChanges();
			expect(component.componentData.acc.sessions[3].isFavorite)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.progressbar'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#moreAccList-item'));
			expect(de)
				.toBeTruthy();

			component.selectedFilterForACC = 'isBookmarked';
			component.selectFilter('ACC');
			fixture.detectChanges();
			expect(component.selectedACC.length)
				.toEqual(2);

			component.setFavorite(acc3);
			fixture.detectChanges();
			expect(component.componentData.acc.sessions[3].isFavorite)
				.toBeFalsy();

			component.selectedFilterForACC = 'recommended';
			component.selectFilter('ACC');
			fixture.detectChanges();

			expect(component.componentData.acc.sessions[0].isFavorite)
				.toBeFalsy();
			expect(component.componentData.acc.sessions[0].status)
			.toEqual('requested');
			expect(component.selectedACC.length)
				.toEqual(1);

			const acc5 = component.componentData.acc.sessions[1];
			expect(acc5.status)
				.toEqual('in-progress');

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

	describe('Success Bytes', () => {
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

		it('should show the Success Bytes view-all modal', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('_SuccessBytes_');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#viewAllModal'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__clear'));
			expect(de)
				.toBeTruthy();

			const sb1 = component.componentData.learning.success[1];
			expect(component.componentData.learning.success[1].bookmark)
				.toBeFalsy();
			component.updateBookmark('SB', sb1);
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

			component.onSort('title', 'asc');
			fixture.detectChanges();
			expect(component.successBytesTable.columns[0].sortDirection)
				.toEqual('desc');

			component.onSort('title', 'desc');
			fixture.detectChanges();
			expect(component.successBytesTable.columns[0].sortDirection)
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
					expect(component.componentData.learning.elearning[0].percentageCompleted)
						.toBeUndefined();
					expect(component.componentData.learning.elearning[1].percentageCompleted)
						.toEqual(25);
					expect(component.componentData.learning.elearning[2].percentageCompleted)
						.toEqual(50);
					expect(component.componentData.learning.elearning[3].percentageCompleted)
						.toEqual(75);
					expect(component.componentData.learning.elearning[4].percentageCompleted)
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
					expect(component.componentData.learning.certifications[0].percentageCompleted)
						.toEqual(25);
					expect(component.componentData.learning.certifications[1].percentageCompleted)
						.toEqual(50);
					expect(component.componentData.learning.certifications[2].percentageCompleted)
						.toEqual(75);
					expect(component.componentData.learning.certifications[3].percentageCompleted)
						.toEqual(100);
					expect(component.componentData.learning.certifications[4].percentageCompleted)
						.toEqual(25);
					expect(component.componentData.learning.certifications[5].percentageCompleted)
						.toEqual(50);
					expect(component.componentData.learning.certifications[6].percentageCompleted)
						.toEqual(75);
					expect(component.componentData.learning.certifications[7].percentageCompleted)
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

	describe('CGT', () => {
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

			de = fixture.debugElement.query(By.css('#compActPct'));
			el = de.nativeElement;
			expect(el.innerText)
				.toEqual('25%');
		});

		it('should show action description when click action name', () => {
			buildSpies();
			sendParams();
			component.selectAction(component.currentPitActionsWithStatus[1]);
			fixture.detectChanges();

			expect(component.currentPitActionsWithStatus[1].selected)
				.toBeTruthy();

			// click the same action again, will unselect the action
			component.selectAction(component.currentPitActionsWithStatus[1]);

			expect(component.currentPitActionsWithStatus[1].selected)
				.toBeFalsy();

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

			// update Action response back with isAtxChanged as true, so need to call ATX API
			expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalledTimes(2);

		});

		it('should refresh ATX if suggestedAction changes', () => {
			buildSpies();
			sendParams();
			component.selectAction(component.currentPitActionsWithStatus[3]);
			fixture.detectChanges();

			expect(component.currentPitActionsWithStatus[3].selected)
				.toBeTruthy();

			expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalled();

		});

		it('should refresh ATX if suggestedAction changes', () => {
			buildSpies();
			sendParams();
			component.completeAction(component.currentPitActionsWithStatus[2].action);
			fixture.detectChanges();

			expect(racetrackService.updatePitstopAction)
				.toHaveBeenCalled();

			// ATX should be refreshed since isAtxChanged is true from updateAction
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
			component.getRacetrackInfo('use');
			component.atxScheduleCardOpened = true;
			fixture.detectChanges();
			de = fixture.debugElement.query(By.css('#AtxScheduleCardRegisterButton'));
			expect(de)
				.toBeFalsy();

			// change pitstop to "implement" (current+1) and check if button is enabled
			component.getRacetrackInfo('implement');
			component.atxScheduleCardOpened = true;
			component.sessionSelected = {
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
				sessionStartDate: 1565127052000,
			};
			fixture.detectChanges();
			de = fixture.debugElement.query(By.css('#AtxScheduleCardRegisterButton'));
			expect(de)
				.toBeTruthy();

			// change pitstop to "Onboard" (current) and check if button is enabled
			component.getRacetrackInfo('Onboard');
			component.atxScheduleCardOpened = true;
			component.sessionSelected = {
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
				sessionStartDate: 1565127052000,
			};
			fixture.detectChanges();
			de = fixture.debugElement.query(By.css('#AtxScheduleCardRegisterButton'));
			expect(de)
				.toBeTruthy();
		});
	});

	describe('Learn - Non-cypress', () => {

		beforeAll(() => {
			window.Cypress = undefined;
		});

		afterAll(() => {
			window.Cypress = undefined;
			window.elearningLoading = undefined;
			window.successPathsLoading = undefined;
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

	describe('Learn - Cypress', () => {

		beforeAll(() => {
			window.Cypress = 'Bogus Cypress Data';
		});

		afterAll(() => {
			window.Cypress = undefined;
			window.elearningLoading = undefined;
			window.successPathsLoading = undefined;
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
		});
	});
});
