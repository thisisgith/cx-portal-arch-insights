import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureReviewComponent } from './architecture-review.component';
import { ArchitectureReviewModule } from './architecture-review.module';

describe('ArchitectureReviewComponent', () => {
	let component: ArchitectureReviewComponent;
	let fixture: ComponentFixture<ArchitectureReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ArchitectureReviewModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArchitectureReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
