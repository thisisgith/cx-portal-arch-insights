import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PotentiallyImpactedAssetsComponent } from './potentially-impacted.component';
import { PotentiallyImpactedAssetsModule } from './potentially-impacted.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import {
	user,
	Mock,
	RacetrackScenarios,
	MockSystemAssetsData,
} from '@mock';
import * as _ from 'lodash-es';
import { InventoryService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
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

describe('PotentiallyImpactedAssetsComponent', () => {
	let component: PotentiallyImpactedAssetsComponent;
	let fixture: ComponentFixture<PotentiallyImpactedAssetsComponent>;
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
				PotentiallyImpactedAssetsModule,
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
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PotentiallyImpactedAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch assets for an advisory', done => {
		component.customerId = user.info.customerId;
		component.assetIds = {
			potentiallyImpacted: [
				'NA,SAL1833YM7D,N9K-C9396PX,NA',
			],
		};

		const data = _.filter(MockSystemAssetsData,
			{ managedNeId: 'NA,SAL1833YM7D,N9K-C9396PX,NA' });
		spyOn(inventoryService, 'getSystemAssets')
			.and
			.returnValue(of({ data }));

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.potentiallyImpacted.length)
				.toEqual(data.length);

			expect(component.potentiallyImpacted)
				.toEqual(data);

			done();
		});
	});

	it('should handle failing api calls for advisories', done => {
		component.customerId = user.info.customerId;
		component.assetIds = {
			potentiallyImpacted: [
				'NA,SAL1833YM7D,N9K-C9396PX,NA',
			],
		};

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getSystemAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.potentiallyImpacted)
				.toEqual([]);

			done();
		});
	});

	it('should refresh on advisory id change', () => {
		spyOn(component, 'refresh');
		component.ngOnChanges({
			id: {
				currentValue: '66417d75',
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(component.refresh)
		.toHaveBeenCalled();
	});
});
