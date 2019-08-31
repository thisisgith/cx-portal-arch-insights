import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { FeedbackComponent } from './feedback.component';
import { FeedbackModule } from './feedback.module';
import { environment } from '@environment';
import { EmailControllerService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { user } from '@mock';

describe('FeedbackComponent', () => {
	let component: FeedbackComponent;
	let fixture: ComponentFixture<FeedbackComponent>;
	let emailControllerService: EmailControllerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FeedbackModule,
				HttpClientTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ProfileService,
					useValue: {
						getProfile () {
							return {
								cpr: {
									pf_auth_email: 'susan@company.com',
									pf_auth_firstname: 'Susan',
									pf_auth_lastname: 'Swanson',
									pf_auth_uid: 'susans',
								},
							};
						},
					},
				},
			],
		})
		.compileComponents();
		emailControllerService = TestBed.get(EmailControllerService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeedbackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		(<any> component).user = user.info;
		component.emailParams.to = user.info.individual.emailAddress;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle thumb button clicks', fakeAsync(() => {
		const thumbUpBtn = fixture.debugElement.query(
			By.css('[data-auto-id="thumbUpBtn"]'),
		);
		const thumbDownBtn = fixture.debugElement.query(
			By.css('[data-auto-id="thumbDownBtn"]'),
		);

		thumbUpBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.thumbsUpSelected)
			.toBeTruthy();

		thumbDownBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.thumbsDownSelected)
			.toBeTruthy();

		thumbDownBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.thumbsDownSelected)
			.toBeFalsy();
	}));

	it('should close modal when click close icon', fakeAsync(() => {
		const closeIcon = fixture.debugElement.query(
			By.css('[data-auto-id="closeModalIcon"]'),
		);

		closeIcon.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.feedbackForm.value.comment)
			.toEqual('');
	}));

	it('should send email response', () => {
		spyOn(emailControllerService, 'sendEmail')
			.and
			.returnValue(of('Email Sent'));
		expect(component.feedbackForm.valid)
			.toBeFalsy();

		expect(component.isSubmitting)
			.toBeFalsy();

		component.feedbackForm.controls.comment.setValue('Testing');
		expect(component.feedbackForm.valid)
			.toBeTruthy();
		fixture.detectChanges();
		component.submitFeedback();

		expect(emailControllerService.sendEmail)
			.toHaveBeenCalled();
	});
});
