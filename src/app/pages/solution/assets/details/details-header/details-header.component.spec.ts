import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AssetScenarios,
	CaseScenarios,
	Mock,
} from '@mock';
import { CaseService } from '@cui-x/services';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash-es';
import { DetailsHeaderComponent } from './details-header.component';
import { DetailsHeaderModule } from './details-header.module';
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

describe('DetailsHeaderComponent', () => {
	let component: DetailsHeaderComponent;
	let fixture: ComponentFixture<DetailsHeaderComponent>;
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
				DetailsHeaderModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();

		caseService = TestBed.get(CaseService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsHeaderComponent);
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

});
