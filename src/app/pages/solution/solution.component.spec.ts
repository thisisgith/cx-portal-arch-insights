import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
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
	user,
} from '@mock';
import * as _ from 'lodash-es';
import { RacetrackService, ProductAlertsService, ContractsService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdvisoriesComponent } from './advisories/advisories.component';
import { CaseService } from '@cui-x/services';

/**
 * MockRouter used to help show/hide the spinner
 */
class MockRouter {
	public subject = new Subject();
	public events = this.subject.asObservable();

	/**
	 * Mocking navigate from Router
	 * @param url The url to mock route to
	 */
	public navigate (url: string) {
		this.subject.next(new NavigationEnd(0, url, null));
	}
}

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
	let racetrackService: RacetrackService;
	let caseService: CaseService;
	let productAlertsService: ProductAlertsService;
	let contractsService: ContractsService;

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

	beforeEach(async(() => {
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
					provide: Router,
					useClass: MockRouter,
				},
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

		contractsService = TestBed.get(ContractsService);
		productAlertsService = TestBed.get(ProductAlertsService);
		caseService = TestBed.get(CaseService);
		racetrackService = TestBed.get(RacetrackService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		router.navigate(['/solution/lifecycle']);
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should change the active tab when the route changes', () => {
		fixture.detectChanges();

		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		router.navigate(['/solution/assets']);

		fixture.detectChanges();

		expect(component.selectedFacet.route)
			.toEqual('/solution/assets');
	});

	it('should not load anything else if racetrack fails', () => {
		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		fixture.detectChanges();

		expect(component.selectedSolution)
			.toBeUndefined();
	});

	it('should change the selected facet', () => {
		fixture.detectChanges();

		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		const assetsFacet = _.find(component.facets, { route: '/solution/assets' });

		component.selectFacet(assetsFacet);

		fixture.detectChanges();

		expect(component.selectedFacet)
			.toEqual(assetsFacet);
	});

	it('should change the active solution', () => {
		buildSpies();

		fixture.detectChanges();

		expect(component.selectedSolution.name)
			.toEqual('IBN');

		component.changeSolution(component.solutions[1]);
	});

	it('should change the active technology', () => {
		buildSpies();

		fixture.detectChanges();

		expect(component.selectedTechnology.name)
			.toEqual('Campus Network Assurance');

		component.changeTechnology(component.selectedSolution.technologies[1]);

		fixture.detectChanges();

		expect(component.selectedTechnology.name)
			.toEqual('Campus Network Segmentation');
	});

	it('should always call getCaseAndRMACount', () => {
		spyOn(component, 'getCaseAndRMACount');
		component.ngOnInit();
		expect(component.getCaseAndRMACount)
			.toHaveBeenCalled();
	});

	it('should handle failing api calls', done => {
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

		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const assetsFacet = _.find(component.facets, { key: 'assets' });
			const advisoryFacet = _.find(component.facets, { key: 'advisories' });
			const resolutionFacet = _.find(component.facets, { key: 'resolution' });

			expect(assetsFacet.loading)
				.toBeFalsy();

			expect(advisoryFacet.loading)
				.toBeFalsy();

			expect(resolutionFacet.loading)
				.toBeFalsy();

			done();
		});
	});

	it('should load the advisoriesFacet', done => {
		spyOn(productAlertsService, 'getVulnerabilityCounts')
			.and
			.returnValue(of(getActiveBody(VulnerabilityScenarios[0])));

		spyOn(contractsService, 'getCoverageCounts')
			.and
			.returnValue(of(getActiveBody(CoverageScenarios[2])));

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			const assetsFacet = _.find(component.facets, { key: 'assets' });
			const advisoryFacet = _.find(component.facets, { key: 'advisories' });

			expect(assetsFacet.data)
				.toEqual({ gaugePercent: 7, gaugeLabel: '7%' });

			const values = _.sum(_.map(advisoryFacet.seriesData, 'value'));

			expect(values)
				.toEqual(11);

			done();
		});
	});
});
