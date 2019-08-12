import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesComponent } from './policies.component';
import { PoliciesModule } from './policies.module';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PolicyResponseModel } from '@sdp-api';
import { PolicesScenarios } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';

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
});
