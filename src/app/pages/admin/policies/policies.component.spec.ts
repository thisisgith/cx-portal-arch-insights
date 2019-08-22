import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesComponent } from './policies.component';
import { PoliciesModule } from './policies.module';

import {
	PolicesScenarios,
} from '@mock';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PolicyResponseModel } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('PoliciesComponent', () => {
	let component: PoliciesComponent;
	let fixture: ComponentFixture<PoliciesComponent>;

	const locationStub = {
		back: jasmine.createSpy('back'),
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PoliciesModule,
				RouterTestingModule,
			],
			providers: [
				{
					provide: Location,
					useValue: locationStub,
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PoliciesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('handle test data', () => {
		it('should handle test data', () => {
			component.policyData = <PolicyResponseModel[]>
				PolicesScenarios[0].scenarios.GET[0].response.body;
			component.handleData();
		});
	});

	it('should start modal', () => {
		component.startModal(false, undefined);

		expect(component.modalVisible)
			.toBeFalsy();

		component.startModal(true, 'test');

		expect(component.modalVisible)
			.toBeTruthy();
		expect(component.modalType)
			.toBe('test');

		const policy: PolicyResponseModel = {
			schedule: '****',
		};

		component.startModal(true, 'test', policy);

		expect(component.modalVisible)
			.toBeTruthy();
		expect(component.modalType)
			.toBe('test');
		expect(component.loadedPolicy)
			.toBe(policy);

	});

	it('should handle submits', () => {
		const response: PolicyResponseModel[] = [{
			deviceCount: 5,
			policyId: 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
			policyType: 'SCAN',
			schedule: '0 0 6 * * *',
		}];

		spyOn(component, 'getPoliciesData')
			.and
			.returnValue(of(response));

		component.collectionRequestSubmit(true);

		expect(component.getPoliciesData)
			.toHaveBeenCalled();
	});
});
