import { configureTestSuite } from 'ng-bullet';
import {
	async,
	ComponentFixture,
	TestBed,
	tick,
	fakeAsync,
	discardPeriodicTasks,
} from '@angular/core/testing';
import {
	AssetScenarios,
	CaseScenarios,
	Mock,
	user,
	MockAssetsData,
	MockNetworkElements,
} from '@mock';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';
import { AssetDetailsHeaderComponent } from './header.component';
import { AssetDetailsHeaderModule } from './header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NetworkDataGatewayService } from '@sdp-api';
import { CuiModalService } from '@cisco-ngx/cui-components';

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

describe('AssetDetailsHeaderComponent', () => {
	let component: AssetDetailsHeaderComponent;
	let fixture: ComponentFixture<AssetDetailsHeaderComponent>;
	let caseService: CaseService;
	let networkService: NetworkDataGatewayService;
	let cuiModalService: CuiModalService;
	let caseSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(caseSpy, 'restore');
	};

	/**
	 * Build spies for our services
	 */
	const buildSpies = () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(of(CaseScenarios[4].scenarios.GET[0].response.body));
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsHeaderModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(async(() => {

		networkService = TestBed.get(NetworkDataGatewayService);
		caseService = TestBed.get(CaseService);
		cuiModalService = TestBed.get(CuiModalService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsHeaderComponent);
		component = fixture.componentInstance;
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing cases api call', () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		const deviceResponse = getActiveBody(AssetScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.openCases)
					.toEqual([]);
			});
	});

	it('should have active class to cases dropdown if active', () => {
		component.casesDropdownActive = true;
		component.openCases = (<any> CaseScenarios[4].scenarios.GET[0].response.body).content;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.open-case-toggle-btn');

		expect(button)
			.toHaveClass('active');
	});

	it('should toggle case list dropdown', () => {
		component.openCases = [];

		fixture.detectChanges();

		expect(component.casesDropdownActive)
			.toBeFalsy();

		component.toggleActiveCases();

		fixture.detectChanges();

		expect(component.casesDropdownActive)
			.toBeTruthy();
	});

	it('should not fail when no serial number is present', () => {
		component.asset = { };

		fixture.detectChanges();

		expect(component.status.loading.cases)
			.toBeFalsy();
	});

	it('should try and fetch cases if a serial number is present', () => {
		buildSpies();

		const deviceResponse = getActiveBody(AssetScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		expect(component.openCases)
			.toEqual((<any> CaseScenarios[4].scenarios.GET[0].response.body).content);
	});

	it('should handle changing assets', () => {
		buildSpies();

		const asset = _.cloneDeep(MockAssetsData[0]);
		const newAsset = _.cloneDeep(MockAssetsData[1]);

		fixture.detectChanges();

		component.asset = asset;
		component.ngOnChanges({
			asset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.asset.serialNumber)
			.toEqual('FOC1544Y16T');

		component.asset = newAsset;
		component.ngOnChanges({
			asset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		expect(component.asset.serialNumber)
			.toEqual('FOC1922S6JU');
	});

	it('should handle failure checking status on a device', done => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		fixture.detectChanges();

		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.status.loading.overall)
				.toBeFalsy();

			done();
		});
	});

	it('should initiate a scan request', fakeAsync(() => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([]));

		spyOn(networkService, 'postDeviceTransactions')
			.and
			.returnValue(of([{
				transactionId: 'fake',
			}]));

		spyOn(networkService, 'getScanStatusByTransaction')
			.and
			.returnValue(of({
				status: 'SUCCESS',
			}));

		component.initiateScan();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should handle a failing initiation scan request without an id', () => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([]));

		spyOn(networkService, 'postDeviceTransactions')
			.and
			.returnValue(of([]));

		component.initiateScan();

		fixture.detectChanges();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});

	it('should handle a failing initiation scan request', () => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([]));

		spyOn(networkService, 'postDeviceTransactions')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.initiateScan();

		fixture.detectChanges();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});

	it('should check for a scan request on load - poll on inProgress', fakeAsync(() => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([
				{
					status: 'IN_PROGRESS',
					transactionId: 'fake',
				},
			]));
		spyOn(networkService, 'getScanStatusByTransaction')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.refresh();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should check for a scan request on load - poll on received', fakeAsync(() => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([
				{
					status: 'RECEIVED',
					transactionId: 'fake',
				},
			]));
		spyOn(networkService, 'getScanStatusByTransaction')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.refresh();

		tick(3000);

		expect(component.status.scan.inProgress)
			.toBeFalsy();

		discardPeriodicTasks();
	}));

	it('should check for a scan request on load - nothing on failure', fakeAsync(() => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(networkService, 'getScanStatusBySerial')
			.and
			.returnValue(of([
				{
					status: 'FAILURE',
					transactionId: 'fake',
				},
			]));

		component.refresh();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	}));

	it('should try and open a case and scan if not success', () => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(cuiModalService, 'showComponent')
		.and
		.returnValue(
			of({ scanStatus: 'SUCCESS' })
			.toPromise());

		component.openCase();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});

	it('should try and open a case and scan if not success', () => {
		component.asset = MockAssetsData[0];
		component.element = MockNetworkElements[0];
		component.customerId = user.info.customerId;

		spyOn(networkService, 'getScanStatusBySerial')
		.and
		.returnValue(of([
			{
				status: 'SUCCESS',
				transactionId: 'fake',
			},
		]));

		spyOn(cuiModalService, 'showComponent')
		.and
		.returnValue(
			of({ scanStatus: 'IN_PROGRESS' })
			.toPromise());

		component.openCase();

		expect(component.status.scan.inProgress)
			.toBeFalsy();
	});
});
