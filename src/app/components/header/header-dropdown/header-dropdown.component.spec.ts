import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderDropdownComponent } from './header-dropdown.component';
import { HeaderDropdownModule } from './header-dropdown.module';

describe('HeaderDropdownComponent', () => {
	let component: HeaderDropdownComponent;
	let fixture: ComponentFixture<HeaderDropdownComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HeaderDropdownModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
