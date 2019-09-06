import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunitiesComponent } from './communities.component';
import { CommunitiesModule } from './communities.module';
import { LifecycleComponent } from '../lifecycle.component';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Mock, RacetrackScenarios } from '@mock';
import { RacetrackService } from '@sdp-api';
import { of } from 'rxjs';
import { RacetrackInfoService } from '@services';

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

describe('CommunitiesComponent', () => {
	let component: CommunitiesComponent;
	let fixture: ComponentFixture<CommunitiesComponent>;
	let racetrackInfoService: RacetrackInfoService;
	let racetrackService: RacetrackService;
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
		racetrackInfoSpy = spyOn(racetrackService, 'getRacetrack')
	 	.and
	 	.returnValue(of(getActiveBody(RacetrackScenarios[0])));
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
				CommunitiesModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{
					provide: LifecycleComponent,
					useClass: LifecycleComponent,
				},
			],
		});
	});

	beforeEach(async(() => {

		racetrackInfoService = TestBed.get(RacetrackInfoService);
		racetrackService = TestBed.get(RacetrackService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommunitiesComponent);
		component = fixture.componentInstance;
		restoreSpies();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('Communities', () => {
		it('should have loaded the Community items', () => {
			buildSpies();
			sendParams();

			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toContain(
							'wireless-and-mobility/bd-p/5956-discussions-getting-started-wireles');
					expect(component.curatedCommunity.url)
						.toContain(
							'campus-network-assurance');
				});
		});

		it('should update the url when UseCase changes to 2nd one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			racetrackInfoService.sendCurrentTechnology(racetrack.solutions[0].technologies[1]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toContain(
							'software-defined-access-sd/bd-p/discussions-sd-access');
					expect(component.curatedCommunity.url)
						.toContain(
							'campus-network-segmentation');
				});
		});

		it('should update the url when UseCase changes to 3rd one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			racetrackInfoService.sendCurrentTechnology(racetrack.solutions[0].technologies[2]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toContain(
							'software-defined-access-sd/bd-p/discussions-sd-access');
					expect(component.curatedCommunity.url)
						.toContain(
							'scalable-access-policy');
				});
		});

		it('should update the url when UseCase changes to 4th one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			racetrackInfoService.sendCurrentTechnology(racetrack.solutions[0].technologies[3]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toContain(
							'cisco-digital-network/bd-p/discussions-dna');
					expect(component.curatedCommunity.url)
						.toContain(
							'network-device-onboarding');
				});
		});

		it('should update the url when UseCase changes to 5th one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			racetrackInfoService.sendCurrentTechnology(racetrack.solutions[0].technologies[4]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toContain(
							'cisco-digital-network/bd-p/discussions-dna');
					expect(component.curatedCommunity.url)
						.toContain(
							'campus-software-image-management');
				});
		});
	});
});
