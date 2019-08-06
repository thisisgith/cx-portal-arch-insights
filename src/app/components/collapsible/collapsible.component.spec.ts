import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleComponent } from './collapsible.component';
import { CollapsibleModule } from './collapsible.module';

describe('CollapsibleComponent', () => {
	let component: CollapsibleComponent;
	let fixture: ComponentFixture<CollapsibleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CollapsibleModule],
		})
		.compileComponents();
	}));

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
