import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvisoryImpactedAssetsComponent } from './impacted-assets.component';
import { AdvisoryImpactedAssetsModule } from './impacted-assets.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import {
	user,
	CriticalBugData,
	CriticalBugAssetsScenarios,
	MockAssetsData,
	Mock,
} from '@mock';
import * as _ from 'lodash-es';
import { DiagnosticsService, InventoryService } from '@sdp-api';
import { throwError, of } from 'rxjs';
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

describe('AdvisoryImpactedAssetsComponent', () => {
	let component: AdvisoryImpactedAssetsComponent;
	let fixture: ComponentFixture<AdvisoryImpactedAssetsComponent>;
	let diagnosticsService: DiagnosticsService;
	let inventoryService: InventoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AdvisoryImpactedAssetsModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();

		inventoryService = TestBed.get(InventoryService);
		diagnosticsService = TestBed.get(DiagnosticsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdvisoryImpactedAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fetch assets for a specific bug', done => {
		component.type = 'bug';
		component.id = _.toString(CriticalBugData[0].id);
		component.customerId = user.info.customerId;

		const data = getActiveBody(CriticalBugAssetsScenarios[0]).data;

		spyOn(diagnosticsService, 'getCriticalBugsAssets')
			.and
			.returnValue(of({ data }));

		component.ngOnInit();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.impacted.length)
				.toEqual(data.length);

			expect(component.impacted)
				.toEqual(data);

			done();
		});
	});

	it('should fetch assets for an advisory', done => {
		component.customerId = user.info.customerId;
		component.assetIds = {
			impacted: [
				'NA,FOC1844X089,WS-C3850-24S,NA',
			],
		};

		const data = _.filter(MockAssetsData, { managedNeId: 'NA,FOC1844X089,WS-C3850-24S,NA' });
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(of({ data }));

		component.ngOnInit();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.impacted.length)
				.toEqual(data.length);

			expect(component.impacted)
				.toEqual(data);

			done();
		});
	});

	it('should handle failing api calls for advisories', done => {
		component.customerId = user.info.customerId;
		component.assetIds = {
			impacted: [
				'NA,FOC1844X089,WS-C3850-24S,NA',
			],
		};

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.impacted)
				.toEqual([]);

			done();
		});
	});

	it('should handle failing api calls for bugs', done => {
		component.type = 'bug';
		component.id = _.toString(CriticalBugData[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(diagnosticsService, 'getCriticalBugsAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.ngOnInit();
		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			expect(component.isLoading)
				.toBeFalsy();

			expect(component.impacted)
				.toEqual([]);

			done();
		});
	});
});
