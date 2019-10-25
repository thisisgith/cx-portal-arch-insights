import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SessionFeedbackComponent } from './session-feedback.component';
import { LifecycleModule } from '../lifecycle.module';
import { RacetrackContentService, UserFeedbackEntitySchema } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UserResolve } from '@utilities';

describe('SessionFeedbackComponent', () => {
	let component: SessionFeedbackComponent;
	let fixture: ComponentFixture<SessionFeedbackComponent>;
	let contentService: RacetrackContentService;
	let userResolve: UserResolve;

	const setItem = (feedbackId: string, available: boolean, thumbs: 'UP' | 'DOWN') => {
		component.item = {
			feedbackInfo: {
				available,
				feedbackId,
				thumbs,
			},
		};
		fixture.detectChanges();
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				LifecycleModule,
			],
		});
	});

	beforeEach(async(() => {
		contentService = TestBed.get(RacetrackContentService);
	}));

	beforeEach(() => {
		userResolve = TestBed.get(UserResolve);
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of('2431199'));
		fixture = TestBed.createComponent(SessionFeedbackComponent);
		component = fixture.componentInstance;
	});

	it('should throw error if no item', () => {
		expect(() => {
			fixture.detectChanges();
		})
		.toThrowError('Attribute \'item\' is required');
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should mark feedbackComplete if feedbackInfo is available', () => {
		setItem(null, true, null);
		expect(component.feedbackComplete)
			.toBeTruthy();
	});

	it('should handle thumb button click', fakeAsync(() => {
		setItem(null, false, null);
		expect(component.showPopup)
			.toBeFalsy();
		const mockResult: UserFeedbackEntitySchema = {
			comment: '',
			feedbackId: 'feedback1',
			thumbs: 'UP',
		};
		const saveFeedbackSpy = spyOn(contentService, 'saveFeedback')
			.and
			.returnValue(of(mockResult));
		const thumbUpBtn = fixture.debugElement.query(
			By.css('[data-auto-id="thumbUpBtn"]'),
		);

		thumbUpBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(saveFeedbackSpy)
			.toHaveBeenCalled();
		expect(component.showPopup)
			.toBeTruthy();
		expect(component.item.feedbackInfo.feedbackId)
			.toBe(mockResult.feedbackId);
		expect(component.item.feedbackInfo.thumbs)
			.toBe(mockResult.thumbs);
	}));

	it('should handle submit button click', fakeAsync(() => {
		setItem(null, false, null);
		component.showPopup = true;
		component.feedbackComplete = false;
		fixture.detectChanges();

		const submitBtn = fixture.debugElement.query(
			By.css('[data-auto-id="feedback-popup-submit-comment"]'),
		);

		const updateFeedbackSpy = spyOn(contentService, 'updateFeedback')
			.and
			.returnValue(of(null));

		submitBtn.nativeElement.click();
		tick();
		fixture.detectChanges();

		expect(component.feedbackComplete)
			.toBeTruthy();
		expect(updateFeedbackSpy)
			.toHaveBeenCalled();
	}));
});
