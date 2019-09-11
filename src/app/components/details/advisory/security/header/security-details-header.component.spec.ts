import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsHeaderComponent } from './security-details-header.component';
import { SecurityDetailsHeaderModule } from './security-details-header.module';

describe('SecurityDetailsHeaderComponent', () => {
	let component: SecurityDetailsHeaderComponent;
	let fixture: ComponentFixture<SecurityDetailsHeaderComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [SecurityDetailsHeaderModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SecurityDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
