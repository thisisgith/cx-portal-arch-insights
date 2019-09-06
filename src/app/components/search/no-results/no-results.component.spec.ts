import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsComponent } from './no-results.component';
import { NoResultsModule } from './no-results.module';

describe('NoResultsComponent', () => {
	let component: NoResultsComponent;
	let fixture: ComponentFixture<NoResultsComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [NoResultsModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NoResultsComponent);
		component = fixture.componentInstance;
		component.query = 'somethingwithnoresults';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
