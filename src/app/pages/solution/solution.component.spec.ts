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
import { Router } from '@angular/router';
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
	let racetrackInfoSpy;
	let racetrackInfoService: RacetrackInfoService;
	let racetrackService: RacetrackService;
	let diagnosticsService: DiagnosticsService;
	let caseService: CaseService;
	let productAlertsService: ProductAlertsService;
	let contractsService: ContractsService;
	let utils: UtilsService;

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
		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(of(getActiveBody(RacetrackScenarios[0])));
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
		localStorage.removeItem('quickTourFirstTime');
		racetrackInfoService = TestBed.get(RacetrackInfoService);
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
		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(throwError(new HttpErrorResponse({
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

		component.changeTechnology(component.selectedSolution.technologies[1]);

		tick();

		expect(component.selectedTechnology.name)
			.toEqual('Campus Network Segmentation');
		discardPeriodicTasks();
	}));

	it('should always call getCaseAndRMACount', fakeAsync(() => {
		spyOn(component, 'getCaseAndRMACount');

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

		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(productAlertsService, 'headAdvisoriesFieldNoticesResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(productAlertsService, 'headAdvisoriesSecurityAdvisoriesResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(diagnosticsService, 'headCriticalBugsResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

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
			.toBeFalsy();

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
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(getActiveBody(VulnerabilityScenarios[0])));

		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(of(getActiveBody(CoverageScenarios[2])));

		sendRacetrack();

		fixture.detectChanges();
		tick(5000);
		const assetsFacet = _.find(component.facets, { key: 'assets' });

		expect(assetsFacet.data)
			.toEqual({ gaugePercent: 7.920792079207921 });
		discardPeriodicTasks();
	}));
});
