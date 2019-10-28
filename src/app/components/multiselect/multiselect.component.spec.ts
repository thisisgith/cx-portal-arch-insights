import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectComponent } from './multiselect.component';
import { MultiselectModule } from './multiselect.module';

describe('MultiselectComponent', () => {
	let component: MultiselectComponent;
	let fixture: ComponentFixture<MultiselectComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [MultiselectModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiselectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
