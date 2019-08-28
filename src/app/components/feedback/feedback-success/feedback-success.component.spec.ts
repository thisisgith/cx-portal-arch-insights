import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSuccessComponent } from './feedback-success.component';
import { FeedbackSuccessModule } from './feedback-success.module';

describe('FeedbackSuccessComponent', () => {
	let component: FeedbackSuccessComponent;
	let fixture: ComponentFixture<FeedbackSuccessComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FeedbackSuccessModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeedbackSuccessComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
