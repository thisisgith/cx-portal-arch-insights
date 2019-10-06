import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BugDetailsComponent } from './bug-details.component';
import { BugDetailsModule } from './bug-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { user, CriticalBugData, Mock, RacetrackScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { DiagnosticsService } from '@sdp-api';
import { of } from 'rxjs';
import { RacetrackInfoService } from '@services';
import * as _ from 'lodash-es';

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

describe('BugDetailsComponent', () => {
	let component: BugDetailsComponent;
	let fixture: ComponentFixture<BugDetailsComponent>;
	let diagnosticsService: DiagnosticsService;
	let racetrackInfoService: RacetrackInfoService;

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
				MicroMockModule,
				BugDetailsModule,
				HttpClientTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		diagnosticsService = TestBed.get(DiagnosticsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BugDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set the data based on the input', done => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnInit();
		sendRacetrack();
		fixture.whenStable()
		.then(() => {
			expect(component.data)
				.toEqual({
					advisory: CriticalBugData[0],
				});

			done();
		});
	});

	it('should emit the advisory for the header', done => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.details
		.subscribe((details => {
			expect(details)
				.toEqual(component.data);

			done();
		}));

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();
	});

	it('should load the bug if only id passed', () => {
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of({ data: [CriticalBugData[0]] }));

		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();

		expect(component.data)
			.toEqual({ advisory: CriticalBugData[0] });
	});

	it('should handle changing bugs', () => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();

		expect(component.data)
			.toEqual({
				advisory: CriticalBugData[0],
			});

		component.advisory = CriticalBugData[1];
		component.id = CriticalBugData[1].id;
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: CriticalBugData[0].id,
			},
		});

		fixture.detectChanges();
		expect(component.data)
			.toEqual({
				advisory: CriticalBugData[1],
			});
	});
});
