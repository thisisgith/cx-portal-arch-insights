import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SmartAccountSelectionComponent } from './smart-account-selection.component';
import { SmartAccountSelectionModule } from './smart-account-selection.module';

describe('SmartAccountSelectionComponent', () => {
	let component: SmartAccountSelectionComponent;
	let fixture: ComponentFixture<SmartAccountSelectionComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SmartAccountSelectionModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartAccountSelectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
