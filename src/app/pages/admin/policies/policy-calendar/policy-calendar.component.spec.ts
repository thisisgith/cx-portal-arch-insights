import { configureTestSuite } from 'ng-bullet';
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
	let getMonthSpy;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PoliciesModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(async(() => {
		cpService = TestBed.get(ControlPointDevicePolicyAPIService);
		getMonthSpy = jest.spyOn(cpService, 'getAllPolicyForGivenMonthUsingGET')
			.mockReturnValue(of(CalendarScenarios[0].scenarios.GET[0].response.body));
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
		getMonthSpy.mockReturnValue(throwError(new HttpErrorResponse({
			status: 404,
		})));
		component.nextMonth();
		expect(getMonthSpy)
			.toHaveBeenCalled();
	});

});
