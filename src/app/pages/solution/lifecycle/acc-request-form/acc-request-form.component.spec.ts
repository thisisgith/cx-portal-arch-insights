import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccRequestFormComponent } from './acc-request-form.component';
import { AccRequestFormModule } from './acc-request-form.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  RacetrackContentService } from '@sdp-api';
import {
	ACCUserInfoScenarios,
	Mock,
} from '@mock';
import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
	let component: AccRequestFormComponent;
	let fixture: ComponentFixture<AccRequestFormComponent>;
	let contentService: RacetrackContentService;

	let accUserInfoSpy;
	let requestAccSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(accUserInfoSpy, 'restore');
		_.invoke(requestAccSpy, 'restore');
	};

	const buildSpies = () => {
		accUserInfoSpy = spyOn(contentService, 'getACCUserInfo')
			.and
			.returnValue(of(getActiveBody(ACCUserInfoScenarios[0])));
	};

	const buildUserInfoFailureSpy = () => {
		requestAccSpy = spyOn(contentService, 'getACCUserInfo')
			.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 500,
			})));
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AccRequestFormModule,
				FormsModule,
				HttpClientTestingModule,
				ReactiveFormsModule,
			],
		});
	});

	beforeEach(async(() => {

		contentService = TestBed.get(RacetrackContentService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AccRequestFormComponent);
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

	it('should clear additionalAttendees when going from multiple to 1', () => {
		const select = fixture.debugElement.query(By.css('#attendees-select'));

		const attendees = component.requestForm.controls.attendees;

		const additionalAttendees = component.requestForm.controls.additionalAttendees;
		expect(attendees.valid)
			.toBeFalsy();

		attendees.setValue('2');
		fixture.detectChanges();
		expect(select.nativeElement.value)
			.toEqual('2');
		attendees.setValue('1');
		fixture.detectChanges();
		expect(select.nativeElement.value)
			.toEqual('1');
		expect(additionalAttendees.hasError('required'))
			.toBeFalsy();

	});

	it('should have invalid form when userInfo call fails', () => {
		buildUserInfoFailureSpy();
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.custData)
			.toBeFalsy();
		expect(component.status.infoError)
			.toBeTruthy();
		expect(component.requestForm.valid)
			.toBeFalsy();

		const attendees = component.requestForm.controls.attendees;
		expect(attendees.valid)
			.toBeFalsy();
		attendees.setValue('1');
		fixture.detectChanges();
		expect(attendees.valid)
			.toBeTruthy();

		const accInterest = component.requestForm.controls.acceleratorInterest;
		expect(accInterest.valid)
			.toBeFalsy();
		accInterest.setValue('test');
		fixture.detectChanges();
		expect(accInterest.valid)
			.toBeTruthy();

		const desiredOutcome = component.requestForm.controls.desiredOutcome;
		expect(desiredOutcome.valid)
			.toBeFalsy();
		desiredOutcome.setValue('test');
		fixture.detectChanges();
		expect(desiredOutcome.valid)
			.toBeTruthy();

		const dnacVersion = component.requestForm.controls.dnacVersion;
		expect(dnacVersion.valid)
			.toBeFalsy();
		dnacVersion.setValue('1.20');
		fixture.detectChanges();
		expect(dnacVersion.valid)
			.toBeTruthy();

		const environment = component.requestForm.controls.environment;
		expect(environment.valid)
			.toBeFalsy();
		environment.setValue('test');
		fixture.detectChanges();
		expect(environment.valid)
			.toBeTruthy();

		const language = component.requestForm.controls.language;
		expect(language.valid)
			.toBeFalsy();
		language.setValue('English');
		fixture.detectChanges();
		expect(language.valid)
			.toBeTruthy();

		const meetingTime = component.requestForm.controls.meetingTime;
		expect(meetingTime.valid)
			.toBeFalsy();
		meetingTime.setValue('Afternoon');
		fixture.detectChanges();
		expect(meetingTime.valid)
			.toBeTruthy();

		const timeZone = component.requestForm.controls.timeZone;
		expect(timeZone.valid)
			.toBeFalsy();
		timeZone.setValue('EasternTime/US');
		fixture.detectChanges();
		expect(timeZone.valid)
			.toBeTruthy();

		fixture.detectChanges();
		expect(component.status.infoError)
			.toBeTruthy();
		expect(component.invalidSubmit)
			.toBeTruthy();
	});

	it('should have invalid form when empty', () => {
		expect(component.requestForm.valid)
			.toBeFalsy();
	});

	it('should add additional attendees', () => {
		const select = fixture.debugElement.query(By.css('#attendees-select'));

		const attendees = component.requestForm.controls.attendees;
		expect(attendees.valid)
			.toBeFalsy();

		attendees.setValue('2');
		fixture.detectChanges();
		expect(select.nativeElement.value)
			.toEqual('2');
		expect(attendees.hasError('required'))
			.toBeFalsy();

		component.addAdditionalAttendeeForms(select.nativeElement.value);

		const additionalAttendees = component.requestForm.get('additionalAttendees');
		expect(additionalAttendees.value.length)
			.toEqual(1);
	});

});
