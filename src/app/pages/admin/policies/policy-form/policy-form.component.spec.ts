import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormComponent } from './policy-form.component';
import { PolicyFormModule } from './policy-form.module';

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PolicyResponseModel } from '@sdp-api';
import { PolicesScenarios } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';


describe('PolicyFormComponent', () => {
	let component: PolicyFormComponent;
	let fixture: ComponentFixture<PolicyFormComponent>;

	const locationStub = {
		back: jasmine.createSpy('back'),
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PolicyFormModule,
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
		fixture = TestBed.createComponent(PolicyFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
