import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CgtRequestFormComponent } from './cgt-request-form.component';
import { CgtRequestFormModule } from './cgt-request-form.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  RacetrackContentService, ContractsService } from '@sdp-api';
import {
	ACCUserInfoScenarios,
	ContractScenarios,
	Mock,
	CGTScenarios,
} from '@mock';
import * as _ from 'lodash-es';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

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

describe('AccRequestFormComponent', () => {
	let component: CgtRequestFormComponent;
	let fixture: ComponentFixture<CgtRequestFormComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let contentService: RacetrackContentService;
	let contractsService: ContractsService;

	let getAccUserInfoSpy;
	let getContractDetailsSpy;
	let requestTrainingSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(getAccUserInfoSpy, 'restore');
		_.invoke(getContractDetailsSpy, 'restore');
		_.invoke(requestTrainingSpy, 'restore');
	};

	const buildSpies = () => {
		getAccUserInfoSpy = spyOn(contentService, 'getACCUserInfo')
			.and
			.returnValue(of(getActiveBody(ACCUserInfoScenarios[0])));

		getContractDetailsSpy = spyOn(contractsService, 'getContractDetails')
			.and
			.returnValue(of(getActiveBody(ContractScenarios[5])));

		requestTrainingSpy = spyOn(contentService, 'requestGroupTraining')
			.and
			.returnValue(of(getActiveBody(CGTScenarios[0], 'POST')));
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CgtRequestFormModule,
				FormsModule,
				HttpClientTestingModule,
				ReactiveFormsModule,
			],
		})
		.compileComponents();

		contentService = TestBed.get(RacetrackContentService);
		contractsService = TestBed.get(ContractsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CgtRequestFormComponent);
		component = fixture.componentInstance;
		restoreSpies();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have loaded customer info', () => {
		buildSpies();
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.custData)
			.toBeTruthy();
	});

	it('should have loaded contracts', () => {
		buildSpies();
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.contractDetails)
			.toBeTruthy();
	});

	it('should have invalid form when empty', () => {
		expect(component.requestForm.valid)
			.toBeFalsy();
	});

	it('should close the form on clicking icon-close', () => {
		de = fixture.debugElement.query(By.css('.icon-close'));
		el = de.nativeElement;

		el.click();

		fixture.detectChanges();

		expect(component.visibleComponent.emit)
			.toBeTruthy();
	});

	it('should close the form on successful form submission', () => {
		buildSpies();
		component.onSubmit();
		fixture.detectChanges();
		expect(component.submitted.emit)
				.toBeTruthy();
		expect(component.formSubmissionSucceeded)
				.toBeFalsy();
	});

	it('submit button should exist', () => {
		de = fixture.debugElement.query(By.css('.btn--primary'));
		expect(de)
			.toBeTruthy();
	});

	it('canel button should exist', () => {
		de = fixture.debugElement.query(By.css('.btn--secondary'));
		expect(de)
			.toBeTruthy();
		el = de.nativeElement;

		el.click();

		fixture.detectChanges();

		expect(component.visibleComponent.emit)
				.toBeTruthy();
	});
});
