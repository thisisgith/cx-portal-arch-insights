import { configureTestSuite } from 'ng-bullet';
import {
	async,
	discardPeriodicTasks,
	fakeAsync,
	flush,
	tick,
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LifecycleComponent } from './lifecycle/lifecycle.component';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { AssetsComponent } from './assets/assets.component';
import { AssetsModule } from './assets/assets.module';
import { AdvisoriesModule } from './advisories/advisories.module';
import { HttpErrorResponse } from '@angular/common/http';
import {
	RacetrackScenarios,
	VulnerabilityScenarios,
	CoverageScenarios,
	Mock,
	user as mockUser,
} from '@mock';
import * as _ from 'lodash-es';
import {
	RacetrackService,
	ProductAlertsService,
	ContractsService,
	DiagnosticsService,
} from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdvisoriesComponent } from './advisories/advisories.component';
import { CaseService } from '@cui-x/services';
import { UtilsService, RacetrackInfoService } from '@services';
import { UserResolve } from '@utilities';
import { ACTIVE_FACET_KEY } from '@constants';
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

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;
	let router: Router;
	let racetrackInfoService: RacetrackInfoService;
	let racetrackService: RacetrackService;
	let diagnosticsService: DiagnosticsService;
	let caseService: CaseService;
	let productAlertsService: ProductAlertsService;
	let contractsService: ContractsService;
	let userResolve: UserResolve;
	let utils: UtilsService;

	let racetrackInfoSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(racetrackInfoSpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		racetrackInfoSpy = jest.spyOn(racetrackService, 'getRacetrack')
			.mockReturnValue(of(getActiveBody(RacetrackScenarios[0])));
	};

	/**
	 * Sends our racetrack info
	 */
	const sendRacetrack = () => {
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		racetrackInfoService.sendCurrentTechnology(
			getActiveBody(RacetrackScenarios[0]).solutions[0].technologies[0],
		);

		racetrackInfoService.sendCurrentAdoptionPercentage(5);
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				AdvisoriesModule,
				HttpClientTestingModule,
				LifecycleModule,
				RouterTestingModule.withRoutes([
					{ path: 'solution/lifecycle', component: LifecycleComponent },
					{ path: 'solution/assets', component: AssetsComponent },
					{ path: 'solution/advisories', component: AdvisoriesComponent },
				]),
				SolutionModule,
			],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							data: {
								user: mockUser,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;
		router = TestBed.get(Router);
	}));

	beforeEach(() => {
		contractsService = TestBed.get(ContractsService);
		productAlertsService = TestBed.get(ProductAlertsService);
		diagnosticsService = TestBed.get(DiagnosticsService);
		caseService = TestBed.get(CaseService);
		racetrackService = TestBed.get(RacetrackService);
		utils = TestBed.get(UtilsService);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		userResolve = TestBed.get(UserResolve);
		localStorage.clear();
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should change the active tab when the route changes', fakeAsync(() => {
		router.navigate(['/solution/lifecycle']);
		fixture.detectChanges();
		tick();

		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		router.navigate(['/solution/assets']);

		tick();

		expect(component.selectedFacet.route)
			.toEqual('/solution/assets');
		tick();
		discardPeriodicTasks();
	}));

	it('should not load anything else if racetrack fails', fakeAsync(() => {
		racetrackInfoSpy = jest.spyOn(racetrackService, 'getRacetrack')
			.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		fixture.detectChanges();
		tick(1000);

		expect(component.selectedSolution)
			.toBeUndefined();
		discardPeriodicTasks();
	}));

	it('should change the selected facet', fakeAsync(() => {
		router.navigate(['/solution/lifecycle']);
		fixture.detectChanges();
		tick();

		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		const lifecyclesFacet = _.find(component.facets, { route: '/solution/lifecycles' });
		const assetsFacet = _.find(component.facets, { route: '/solution/assets' });

		component.selectFacet(assetsFacet);
		tick(1000);

		expect(component.selectedFacet)
			.toEqual(assetsFacet);
		expect(component.quickTourActive)
			.toBeFalsy();
		expect(window.localStorage.getItem(ACTIVE_FACET_KEY))
			.toEqual(assetsFacet.key);

		component.selectFacet(lifecyclesFacet);
		tick(1000);
		expect(component.quickTourActive)
			.toBeFalsy();
		flush();
		discardPeriodicTasks();
	}));

	it('should change the active solution', fakeAsync(() => {
		buildSpies();
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		tick();
		fixture.detectChanges();
		tick();

		expect(component.selectedSolution.name)
			.toEqual('IBN');

		component.changeSolution(null);
		tick();
		expect(component.selectedSolution)
			.toBeNull();
		discardPeriodicTasks();
	}));

	it('should change the active technology', fakeAsync(() => {
		buildSpies();

		sendRacetrack();

		tick();
		fixture.detectChanges();
		tick();

		expect(component.selectedTechnology.name)
			.toEqual('Campus Network Assurance');

		const lifecycleFacet = _.find(component.facets, { key: 'lifecycle' });
		expect(lifecycleFacet.data)
			.toEqual({ gaugePercent: 5 });

		component.changeTechnology(component.selectedSolution.technologies[1]);

		tick();

		expect(component.selectedTechnology.name)
			.toEqual('Campus Network Segmentation');
		discardPeriodicTasks();
	}));

	it('should change the active smart account', fakeAsync(() => {
		jest.spyOn(userResolve, 'setSaId')
			.mockReturnThis();
		component.changeSmartAccount(123);
		tick();
		expect(userResolve.setSaId)
		.toHaveBeenCalledWith(123);
	}));

	it('should update the dropdown status', fakeAsync(() => {
		expect(component.status.dropdowns)
		.toEqual({
			smartAccount: false,
			solution: false,
			technology: false,
		});
		component.changeDropdownSelection('smartAccount');
		tick();
		expect(component.status.dropdowns)
		.toEqual({
			smartAccount: true,
			solution: false,
			technology: false,
		});
	}));

	it('should always call getCaseAndRMACount', fakeAsync(() => {
		jest.spyOn(component, 'getCaseAndRMACount');

		sendRacetrack();

		fixture.detectChanges();
		tick(1000);
		expect(component.getCaseAndRMACount)
			.toHaveBeenCalled();
		discardPeriodicTasks();
	}));

	it('should handle failing api calls', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};

		jest.spyOn(caseService, 'read')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		jest.spyOn(contractsService, 'getCoverageCounts')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		jest.spyOn(productAlertsService, 'headAdvisoriesFieldNoticesResponse')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		jest.spyOn(productAlertsService, 'headAdvisoriesSecurityAdvisoriesResponse')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		jest.spyOn(diagnosticsService, 'headCriticalBugsResponse')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));

		sendRacetrack();
		tick();

		fixture.detectChanges();
		tick(1000);

		const assetsFacet = _.find(component.facets, { key: 'assets' });
		const advisoryFacet = _.find(component.facets, { key: 'advisories' });
		const resolutionFacet = _.find(component.facets, { key: 'resolution' });

		expect(assetsFacet.loading)
			.toBeFalsy();

		expect(advisoryFacet.loading)
			.toBeTruthy();

		expect(resolutionFacet.loading)
			.toBeFalsy();
		discardPeriodicTasks();
	}));

	it('should open Quick Tour when first time null', fakeAsync(() => {
		router.navigate(['/solution/lifecycle']);
		fixture.detectChanges();
		tick();
		expect(component.quickTourActive)
			.toBeTruthy();
		// Get rid of remaining timers which are still in queue for some reason
		discardPeriodicTasks();
	}));

	it('should open Quick Tour when first time true', fakeAsync(() => {
		utils.setLocalStorage('quickTourFirstTime', { firstTime: true });
		router.navigate(['/solution/lifecycle']);
		tick();
		fixture.detectChanges();
		tick();
		expect(component.quickTourActive)
			.toBeTruthy();
		// Get rid of remaining timers which are still in queue for some reason
		discardPeriodicTasks();
	}));

	it('should not open Quick Tour when not first time', fakeAsync(() => {
		utils.setLocalStorage('quickTourFirstTime', { firstTime: false });
		router.navigate(['/solution/lifecycle']);
		tick();
		fixture.detectChanges();
		tick();
		expect(component.quickTourActive)
			.toBeFalsy();
		// Get rid of remaining timers which are still in queue for some reason
		discardPeriodicTasks();
	}));

	it('should load the advisoriesFacet', fakeAsync(() => {
		router.navigate(['/solution/assets']);
		jest.spyOn(productAlertsService, 'getVulnerabilityCounts')
			.mockReturnValue(of(getActiveBody(VulnerabilityScenarios[0])));

		jest.spyOn(contractsService, 'getCoverageCounts')
			.mockReturnValue(of(getActiveBody(CoverageScenarios[2])));

		sendRacetrack();

		fixture.detectChanges();
		tick(5000);
		const assetsFacet = _.find(component.facets, { key: 'assets' });

		expect(assetsFacet.data)
			.toEqual({ gaugePercent: 7.920792079207921 });
		discardPeriodicTasks();
	}));

	it('should call getCaseAndRMACount on fetchCaseAndRmaCountOnRefresh()', fakeAsync(() => {
		jest.spyOn(component, 'getCaseAndRMACount')
			.mockReturnValue(of({ }));
		component.fetchCaseAndRmaCountOnRefresh();
		fixture.detectChanges();
		expect(component.getCaseAndRMACount)
			.toHaveBeenCalled();

		discardPeriodicTasks();
		flush();
	}));

});
