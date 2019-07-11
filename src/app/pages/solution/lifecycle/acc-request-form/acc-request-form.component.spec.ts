import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccRequestFormComponent } from './acc-request-form.component';
import { AccRequestFormModule } from './acc-request-form.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AccRequestFormComponent', () => {
	let component: AccRequestFormComponent;
	let fixture: ComponentFixture<AccRequestFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AccRequestFormModule,
				ReactiveFormsModule,
				FormsModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AccRequestFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
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
