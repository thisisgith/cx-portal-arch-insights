import { configureTestSuite } from 'ng-bullet';
import {
	async,
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import {
	CaseScenarios,
	MockSystemAssetsData,
} from '@mock';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';
import { AssetDetailsHeaderComponent } from './header.component';
import { AssetDetailsHeaderModule } from './header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
		caseSpy = jest.spyOn(caseService, 'read')
			.mockReturnValue(of(CaseScenarios[4].scenarios.GET[0].response.body));
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
		caseSpy = jest.spyOn(caseService, 'read')
			.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));

		const asset = MockSystemAssetsData[0];

		component.systemAsset = asset;

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

		expect(button.classList.contains('active'))
			.toBe(true);
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
		component.systemAsset = { };

		fixture.detectChanges();

		expect(component.status.loading.cases)
			.toBeFalsy();
	});

	it('should try and fetch cases if a serial number is present', () => {
		buildSpies();

		const asset = MockSystemAssetsData[0];
		component.systemAsset = asset;

		fixture.detectChanges();

		expect(component.openCases)
			.toEqual((<any> CaseScenarios[4].scenarios.GET[0].response.body).content);
	});

	it('should handle changing assets', () => {
		buildSpies();

		const asset = _.cloneDeep(MockSystemAssetsData[0]);
		const newAsset = _.cloneDeep(MockSystemAssetsData[1]);

		fixture.detectChanges();

		component.systemAsset = asset;
		component.ngOnChanges({
			systemAsset: {
				currentValue: asset,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.systemAsset.serialNumber)
			.toEqual('SAL1833YM7D');

		component.systemAsset = newAsset;
		component.ngOnChanges({
			systemAsset: {
				currentValue: newAsset,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: asset,
			},
		});

		expect(component.systemAsset.serialNumber)
			.toEqual('FOC1610R0L4');
	});

});
