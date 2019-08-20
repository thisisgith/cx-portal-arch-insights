import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCalendarComponent } from './policy-calendar.component';
import { PoliciesModule } from '../policies.module';

import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlPointDevicePolicyAPIService } from '@sdp-api';
import { CalendarScenarios } from '@mock';
import { of, throwError } from 'rxjs';

describe('PolicyCalendarComponent', () => {
	let component: PolicyCalendarComponent;
	let fixture: ComponentFixture<PolicyCalendarComponent>;
	let cpService: ControlPointDevicePolicyAPIService;
	let getMonthSpy: jasmine.Spy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PoliciesModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
		cpService = TestBed.get(ControlPointDevicePolicyAPIService);
		getMonthSpy = spyOn(cpService, 'getAllPolicyForGivenMonthUsingGET')
			.and
			.returnValue(of(CalendarScenarios[0].scenarios.GET[0].response.body));
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PolicyCalendarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should go to next month', () => {
		component.nextMonth();
		expect(component.monthIndex)
			.toBe(1);
	});

	it('should go to previous month', async(() => {
		component.prevMonth();
		expect(component.monthIndex)
			.toBe(-1);
		expect(getMonthSpy)
			.toHaveBeenCalled();
	}));

	it('should catch http error', () => {
		getMonthSpy.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
			})));
		component.nextMonth();
		expect(getMonthSpy)
			.toHaveBeenCalled();
	});
});
