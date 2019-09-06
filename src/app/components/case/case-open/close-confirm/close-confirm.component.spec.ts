import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseConfirmComponent } from './close-confirm.component';
import { CloseConfirmModule } from './close-confirm.module';

describe('CloseConfirmComponent', () => {
	let component: CloseConfirmComponent;
	let fixture: ComponentFixture<CloseConfirmComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CloseConfirmModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CloseConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
