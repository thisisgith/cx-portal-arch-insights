import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoDNACHeaderComponent } from './no-dnac-header.component';
import { NoDNACHeaderModule } from './no-dnac-header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import { UserResolve } from '@utilities';
import { of, throwError } from 'rxjs';
import { UserRoles } from '@constants';
import { RacetrackInfoService } from '@services';
import { RacetrackScenarios, Mock } from '@mock';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import * as _ from 'lodash-es';
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

describe('NoDNACHeaderComponent', () => {
	let component: NoDNACHeaderComponent;
	let fixture: ComponentFixture<NoDNACHeaderComponent>;
	let racetrackInfoService: RacetrackInfoService;
	let userResolveService: UserResolve;
	let cpService: ControlPointIERegistrationAPIService;

	const sendRacetrack = () => {
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		racetrackInfoService.sendCurrentTechnology(
			getActiveBody(RacetrackScenarios[0]).solutions[0].technologies[0],
		);
		racetrackInfoService.sendPitStopApiFailure({ });
	};

	const buildSpies = () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(cpService, 'getIESetupCompletionStatusUsingGET')
			.and
			.returnValue(of({ }));
		spyOn(userResolveService, 'getRole')
			.and
			.returnValue(of(<any> UserRoles));
		spyOn(racetrackInfoService, 'getPitStopApiFailure')
			.and
			.returnValue(of(throwError(new HttpErrorResponse(error))));
		sendRacetrack();
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NoDNACHeaderModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NoDNACHeaderComponent);
		component = fixture.componentInstance;
		userResolveService = TestBed.get(UserResolve);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		cpService = TestBed.get(ControlPointIERegistrationAPIService);
		fixture.detectChanges();
		window.Cypress = 'Bogus Cypress Data';
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch role name from account api', () => {
		buildSpies();
		expect(cpService.getIESetupCompletionStatusUsingGET)
		.toHaveBeenCalled();
	});

});
