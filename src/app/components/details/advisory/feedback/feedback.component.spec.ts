import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdvisoryFeedbackComponent } from './feedback.component';
import { AdvisoryFeedbackModule } from './feedback.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('AdvisoryFeedbackComponent', () => {
	let component: AdvisoryFeedbackComponent;
	let fixture: ComponentFixture<AdvisoryFeedbackComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AdvisoryFeedbackModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
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
		expect(component.upVoteSelected)
			.toEqual(true);
		expect(component.downVoteSelected)
			.toEqual(false);

		downVoteBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.upVoteSelected)
			.toEqual(false);
		expect(component.downVoteSelected)
			.toEqual(true);

		downVoteBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.upVoteSelected)
			.toEqual(false);
		expect(component.downVoteSelected)
			.toEqual(false);
	}));
});
