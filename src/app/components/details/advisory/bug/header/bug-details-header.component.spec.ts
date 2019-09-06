import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugDetailsHeaderComponent } from './bug-details-header.component';
import { BugDetailsHeaderModule } from './bug-details-header.module';

describe('BugDetailsHeaderComponent', () => {
	let component: BugDetailsHeaderComponent;
	let fixture: ComponentFixture<BugDetailsHeaderComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [BugDetailsHeaderModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BugDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
