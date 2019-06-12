import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	HardwareScenarios,
	Mock,
} from '@mock';
import { AssetDetailsComponent } from './details.component';
import { AssetDetailsModule } from './details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
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

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;
	let caseService: CaseService;

	let caseSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(caseSpy, 'restore');
	};

	/**
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(of({ totalElements: 30 }));
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();

		caseService = TestBed.get(CaseService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
		restoreSpies();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should not fail when no serial number is present', () => {
		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		_.set(asset, 'serialNumber', null);

		component.asset = asset;

		fixture.detectChanges();

		expect(component.status.loading.cases)
			.toBeFalsy();
	});

	it('should try and fetch cases if a serial number is present', () => {
		buildSpies();

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		expect(component.componentData.openCases)
			.toEqual(30);
	});

	it('should handle failing cases api call', () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.componentData.openCases)
					.toEqual(0);
			});
	});

	it('should handle clearing an asset', () => {
		buildSpies();

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		component.asset = asset;

		fixture.detectChanges();

		expect(component.asset.serialNumber)
			.toEqual('1234');

		component.clearAsset();

		fixture.detectChanges();

		expect(component.asset)
			.toBeNull();
	});

	it('should handle changing assets', () => {
		buildSpies();

		const deviceResponse = getActiveBody(HardwareScenarios[0]);
		const asset = _.cloneDeep(_.head(_.get(deviceResponse, 'data')));

		const newAsset = _.cloneDeep(_.get(deviceResponse, 'data')[1]);

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
			.toEqual('1234');

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
			.toEqual('AAA');
	});
});
