import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle.component';
import { LifecycleModule } from './lifecycle.module';
import { RacetrackService, RacetrackContentService } from '@cui-x/sdp-api';
import { SolutionService } from '../solution.service';
import {
	RacetrackScenarios,
	ATXScenarios,
	ACCScenarios,
	CommunitiesScenarios,
	ELearningScenarios,
	SuccessPathScenarios,
	ActionScenarios,
	Mock,
} from '@mock';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

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
	let racetrackCommunitiesSpy;
	let racetrackLearningSpy;
	let racetrackInfoSpy;
	let racetrackSPSpy;
	let racetrackActionSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(racetrackATXSpy, 'restore');
		_.invoke(racetrackInfoSpy, 'restore');
		_.invoke(racetrackAccSpy, 'restore');
		_.invoke(racetrackLearningSpy, 'restore');
		_.invoke(racetrackCommunitiesSpy, 'restore');
		_.invoke(racetrackSPSpy, 'restore');
		_.invoke(racetrackActionSpy, 'restore');
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

		racetrackLearningSpy = spyOn(racetrackContentService, 'getRacetrackElearning')
			.and
			.returnValue(of(getActiveBody(ELearningScenarios[0])));

		racetrackSPSpy = spyOn(racetrackContentService, 'getRacetrackSuccessPaths')
			.and
			.returnValue(of(getActiveBody(SuccessPathScenarios[0])));

		racetrackCommunitiesSpy = spyOn(racetrackContentService, 'getRacetrackCommunities')
			.and
			.returnValue(of(getActiveBody(CommunitiesScenarios[0])));

		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(of(getActiveBody(RacetrackScenarios[0])));

		racetrackActionSpy = spyOn(racetrackService, 'updatePitstopAction')
			.and
			.returnValue(of(getActiveBody(ActionScenarios[0], 'PATCH')));
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

	describe('ATX', () => {
		it('should have loaded the atx items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.componentData.atx.sessions.length)
						.toEqual(9);
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

			racetrackCommunitiesSpy = spyOn(racetrackContentService, 'getRacetrackCommunities')
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

			expect(component.componentData.communities)
				.toBeUndefined();
		});

		it('should have a selected session', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			const recommended = component.componentData.atx.recommended;

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

			de = fixture.debugElement.query(By.css('#atxModal'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__green'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__clear'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#atxModal'));
			expect(de)
				.toBeFalsy();
		});

		it('should show the acc view-all modal', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			component.showModal('acc');
			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#accModal'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__green'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__clear'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.ribbon__blue'));
			expect(de)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('.icon-close'));
			el = de.nativeElement;

			el.click();

			fixture.detectChanges();

			expect(component.modal.visible)
				.toBeFalsy();

			de = fixture.debugElement.query(By.css('#accModal'));
			expect(de)
				.toBeFalsy();
		});

		describe('PitstopActions', () => {

			it('should show 25% in the prograss label', () => {
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
		});
	});

	it('should have loaded the community items', () => {
		buildSpies();
		sendParams();

		fixture.detectChanges();
		fixture.whenStable()
			.then(() => {
				expect(component.componentData.communities.length)
					.toEqual(2);
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

			expect(window.Cypress).toBe(undefined);
			expect(window.elearningLoading).toBe(undefined);
			expect(window.successPathsLoading).toBe(undefined);
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

			expect(window.Cypress).toEqual('Bogus Cypress Data');
			expect(window.elearningLoading).toBe(false);
			expect(window.successPathsLoading).toBe(false);
		});
	});
});
