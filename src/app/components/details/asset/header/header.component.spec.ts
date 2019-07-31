import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	CaseScenarios,
	Mock,
	MockAssetsData,
} from '@mock';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';
import { AssetDetailsHeaderComponent } from './header.component';
import { AssetDetailsHeaderModule } from './header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

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

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsHeaderModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();

		caseService = TestBed.get(CaseService);
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

	it('should have active class to cases dropddown if active', () => {
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

});