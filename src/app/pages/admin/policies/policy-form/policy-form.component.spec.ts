import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyFormComponent } from './policy-form.component';
import { PolicyFormModule } from './policy-form.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  RacetrackContentService } from '@sdp-api';
import {
	ACCUserInfoScenarios,
	Mock,
} from '@mock';
import * as _ from 'lodash-es';
import { of } from 'rxjs';

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

describe('PolicyFormComponent', () => {
	let component: PolicyFormComponent;
	let fixture: ComponentFixture<PolicyFormComponent>;
	let contentService: RacetrackContentService;

	let accUserInfoSpy;

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(accUserInfoSpy, 'restore');
	};

	const buildSpies = () => {
		accUserInfoSpy = spyOn(contentService, 'getACCUserInfo')
			.and
			.returnValue(of(getActiveBody(ACCUserInfoScenarios[0])));
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				PolicyFormModule,
				FormsModule,
				HttpClientTestingModule,
				ReactiveFormsModule,
			],
		})
		.compileComponents();

		contentService = TestBed.get(RacetrackContentService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PolicyFormComponent);
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
