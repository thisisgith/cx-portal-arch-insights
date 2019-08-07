import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunitiesComponent } from './communities.component';
import { CommunitiesModule } from './communities.module';
import { SolutionService } from '../../solution.service';
import { LifecycleComponent } from '../lifecycle.component';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Mock, RacetrackScenarios } from '@mock';
import { RacetrackService } from '@sdp-api';
import { of } from 'rxjs';

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
	let solutionService: SolutionService;
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

		solutionService.sendCurrentSolution(racetrack.solutions[0]);

		solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[0]);
	};

	beforeEach(async(() => {
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
		})
		.compileComponents();

		solutionService = TestBed.get(SolutionService);
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
						.toEqual(
							'https://community.cisco.com/t5/wireless-and-mobility' +
						'/bd-p/5956-discussions-getting-started-wireles');
					expect(component.curatedCommunity.url)
					.toEqual(
						'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel' +
						'?board=lifecycle-wireless-assurance&amp;labels=Onboard');
				});
		});

		it('should update the url when UseCase changes to 2nd one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[1]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toEqual(
							'https://community.cisco.com/t5/software-defined-access-sd' +
							'/bd-p/discussions-sd-access');
					expect(component.curatedCommunity.url)
					.toEqual(
						'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel' +
						'?board=lifecycle-network-segmentation&amp;labels=Onboard');
				});
		});

		it('should update the url when UseCase changes to 3rd one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[2]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toEqual(
							'https://community.cisco.com/t5/software-defined-access-sd' +
							'/bd-p/discussions-sd-access');
					expect(component.curatedCommunity.url)
					.toEqual(
						'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel' +
						'?board=lifecycle-converged-mgmt&amp;labels=Onboard');
				});
		});

		it('should update the url when UseCase changes to 4th one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[3]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toEqual(
							'https://community.cisco.com/t5/cisco-digital-network' +
							'/bd-p/discussions-dna');
					expect(component.curatedCommunity.url)
					.toEqual(
						'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel' +
						'?board=lifecycle-onboard&amp;labels=Onboard');
				});
		});

		it('should update the url when UseCase changes to 5th one', () => {
			const racetrack = getActiveBody(RacetrackScenarios[0]);
			solutionService.sendCurrentTechnology(racetrack.solutions[0].technologies[4]);
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(component.publicCommunity.url)
						.toEqual(
							'https://community.cisco.com/t5/cisco-digital-network' +
							'/bd-p/discussions-dna');
					expect(component.curatedCommunity.url)
					.toEqual(
						'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel' +
						'?board=lifecycle-swim&amp;labels=Onboard');
				});
		});
	});
});
