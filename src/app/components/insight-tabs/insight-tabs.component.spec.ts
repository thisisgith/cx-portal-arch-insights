import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightTabsComponent } from './insight-tabs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InsightTabsModule } from './insight-tabs.module';

describe('InsightTabsComponent', () => {
	let component: InsightTabsComponent;
	let fixture: ComponentFixture<InsightTabsComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				InsightTabsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
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
