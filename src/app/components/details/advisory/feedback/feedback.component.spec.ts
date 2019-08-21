import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdvisoryFeedbackComponent } from './feedback.component';
import { AdvisoryFeedbackModule } from './feedback.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { user } from '@mock';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FeedbackService } from '@sdp-api';
import { Alert } from '@interfaces';

describe('AdvisoryFeedbackComponent', () => {
	let component: AdvisoryFeedbackComponent;
	let fixture: ComponentFixture<AdvisoryFeedbackComponent>;
	let feedbackService: FeedbackService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AdvisoryFeedbackModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();

		feedbackService = TestBed.get(FeedbackService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdvisoryFeedbackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle vote button clicks', fakeAsync(() => {
		const upVoteBtn = fixture.debugElement.query(
			By.css('[data-auto-id="upVoteBtn"]'),
		);
		const downVoteBtn = fixture.debugElement.query(
			By.css('[data-auto-id="downVoteBtn"]'),
		);

		upVoteBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.rating)
			.toEqual('thumbsUp');

		downVoteBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.rating)
			.toEqual('thumbsDown');

		downVoteBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.rating)
			.toBeNull();
	}));

	it('should emit a failure message on failing bug calls', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};

		spyOn(feedbackService, 'postAdvisoryFeedback')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.type = 'bug';
		component.customerId = user.info.customerId;
		component.feedbackForm.controls.feedback.setValue('Testing');
		component.voteClicked('thumbsUp');

		fixture.detectChanges();

		component.alertMessage
		.subscribe((alert: Alert) => {
			expect(alert.message)
				.toContain('Failed');

			expect(alert.severity)
				.toEqual('danger');

			done();
		});

		component.submitFeedback();
	});

	it('should emit a success message on successful field notice calls', done => {
		spyOn(feedbackService, 'postAdvisoryFeedback')
			.and
			.returnValue(of('success'));

		component.type = 'field';
		component.customerId = user.info.customerId;
		component.feedbackForm.controls.feedback.setValue('Testing');

		component.alertMessage
		.subscribe((alert: Alert) => {
			expect(alert.message.toLowerCase())
				.toContain('submitted');

			expect(alert.severity)
				.toEqual('success');

			done();
		});

		component.submitFeedback();
		fixture.detectChanges();
	});

	it('should emit a success message on successful security advisory calls', done => {
		spyOn(feedbackService, 'postAdvisoryFeedback')
			.and
			.returnValue(of('success'));

		component.type = 'security';
		component.customerId = user.info.customerId;
		component.feedbackForm.controls.feedback.setValue('Testing');

		component.alertMessage
		.subscribe((alert: Alert) => {
			expect(alert.message.toLowerCase())
				.toContain('submitted');

			expect(alert.severity)
				.toEqual('success');

			done();
		});

		component.submitFeedback();
		fixture.detectChanges();
	});
});
