import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleComponent } from './collapsible.component';
import { CollapsibleModule } from './collapsible.module';

describe('CollapsibleComponent', () => {
	let component: CollapsibleComponent;
	let fixture: ComponentFixture<CollapsibleComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CollapsibleModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CollapsibleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
