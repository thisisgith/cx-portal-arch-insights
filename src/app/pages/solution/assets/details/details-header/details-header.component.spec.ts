import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import {
	HardwareScenarios,
	Mock,
} from '@mock';
import { of } from 'rxjs';
import { CaseService } from '@cui-x/services';

import { DetailsHeaderComponent } from './details-header.component';
import { DetailsHeaderModule } from './details-header.module';

/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody(mock: Mock, type: string = 'GET') {
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
	 * Builds our spies for our services
	 */
	const buildSpies = () => {
		caseSpy = spyOn(caseService, 'read')
			.and
			.returnValue(of({ totalElements: 30 }));
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DetailsHeaderModule],
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

	it('should not have active class if actions dropdown is not active', () => {
		component.actionDropdownActive = false;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.dropdown--actions');

		expect(button)
			.not
			.toHaveClass('active');
	});

	it('should have active class to cases dropddown if active', () => {
		component.casesDropdownActive = true;
		component.componentData.openCases = 1;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.open-case-toggle-btn');

		expect(button)
			.toHaveClass('active');
	});

	it('should not add active class to cases dropddown if not active', () => {
		component.casesDropdownActive = false;
		component.componentData.openCases = 1;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.open-case-toggle-btn');

		expect(button)
			.not
			.toHaveClass('active');
	});

	it('should have active class if actions dropdown is active', () => {
		component.actionDropdownActive = true;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.dropdown--actions');

		expect(button)
			.toHaveClass('active');
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

});
