import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFailedComponent } from './feedback-failed.component';
import { FeedbackFailedModule } from './feedback-failed.module';

describe('FeedbackFailedComponent', () => {
	let component: FeedbackFailedComponent;
	let fixture: ComponentFixture<FeedbackFailedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FeedbackFailedModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeedbackFailedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
