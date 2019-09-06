import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldNoticeDetailsHeaderComponent } from './field-notice-details-header.component';
import { FieldNoticeDetailsHeaderModule } from './field-notice-details-header.module';

describe('FieldNoticeDetailsHeaderComponent', () => {
	let component: FieldNoticeDetailsHeaderComponent;
	let fixture: ComponentFixture<FieldNoticeDetailsHeaderComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [FieldNoticeDetailsHeaderModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FieldNoticeDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
