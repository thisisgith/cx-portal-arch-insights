import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsComponent } from './security-details.component';
import { SecurityDetailsModule } from './security-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { ProductAlertsService, InventoryService } from '@sdp-api';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import {
	user,
	MockAdvisorySecurityAdvisories,
	MockSecurityAdvisoryBulletins,
	MockSecurityAdvisories,
	RacetrackScenarios,
	Mock,
} from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
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

describe('SecurityDetailsComponent', () => {
	let component: SecurityDetailsComponent;
	let fixture: ComponentFixture<SecurityDetailsComponent>;
	let productAlertsService: ProductAlertsService;
	let inventoryService: InventoryService;
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
				HttpClientTestingModule,
				SecurityDetailsModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecurityDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockAdvisorySecurityAdvisories[0],
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();
	});

	it('should fetch the advisory information given an advisory', done => {
		const mockAdvisories = _.filter(MockSecurityAdvisories,
			{ advisoryId: MockAdvisorySecurityAdvisories[0].id });

		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(of({ data: mockAdvisories }));

		const bulletins = _.filter(MockSecurityAdvisoryBulletins,
			{ securityAdvisoryInstanceId: MockAdvisorySecurityAdvisories[0].id });
		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(of({ data: bulletins }));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockAdvisorySecurityAdvisories[0],
					assetIds: component.data.assetIds,
					bulletin: _.head(bulletins),
					notice: _.head(mockAdvisories),
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();
	});

	it('should handle changing advisories', () => {
		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
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

		expect(component.data.advisory)
			.toEqual(MockAdvisorySecurityAdvisories[0]);

		component.advisory = MockAdvisorySecurityAdvisories[1];
		component.id = _.toString(MockAdvisorySecurityAdvisories[1].id);
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(MockAdvisorySecurityAdvisories[1].id),
			},
		});

		fixture.detectChanges();
		expect(component.data.advisory)
			.toEqual(MockAdvisorySecurityAdvisories[1]);
	});
});
