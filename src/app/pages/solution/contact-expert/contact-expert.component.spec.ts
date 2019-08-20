import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactExpertComponent } from './contact-expert.component';
import { ContactExpertModule } from './contact-expert.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('ContactExpertComponent', () => {
	let component: ContactExpertComponent;
	let fixture: ComponentFixture<ContactExpertComponent>;
	let osvService: OSVService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ContactExpertModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactExpertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should turn off loading indicator once we send support email', () => {
		spyOn(osvService, 'contactSupport')
			.and
			.returnValue(of({ status: true, message: 'Message Sent', messageDetails: '' }));
		component.submitMessage();
		fixture.detectChanges();
		expect(component.modelHeading)
			.toEqual('test message');
		expect(component.showLoader)
			.toBe(false);
	});

	it('Error scenario when email sending fails, if the status is false', () => {
		spyOn(osvService, 'contactSupport')
			.and
			.returnValue(of({ status: false, message: 'Failed to Send', messageDetails: '' }));
		component.submitMessage();
		fixture.detectChanges();
		expect(component.modelHeading)
			.toEqual('test message');
		expect(component.showLoader)
			.toBe(false);
	});

	it('Should display custom error when api is not available due to network failure', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'contactSupport')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.submitMessage();
		fixture.detectChanges();
		expect(component.modelHeading)
			.toEqual('Failed to Send');
		expect(component.showLoader)
			.toBe(false);
	});
});
