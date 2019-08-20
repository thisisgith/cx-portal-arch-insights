import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactSupportComponent } from './contact-support.component';
import { ContactSupportModule } from './contact-support.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('ContactSupportComponent', () => {
	let component: ContactSupportComponent;
	let fixture: ComponentFixture<ContactSupportComponent>;
	let osvService: OSVService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ContactSupportModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactSupportComponent);
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
