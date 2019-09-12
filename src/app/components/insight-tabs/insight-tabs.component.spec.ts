import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightTabsComponent } from './insight-tabs.component';

describe('InsightTabsComponent', () => {
	let component: InsightTabsComponent;
	let fixture: ComponentFixture<InsightTabsComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [InsightTabsComponent],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InsightTabsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});
});
