import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderDropdownComponent } from './header-dropdown.component';
import { HeaderDropdownModule } from './header-dropdown.module';

describe('HeaderDropdownComponent', () => {
	let component: HeaderDropdownComponent;
	let fixture: ComponentFixture<HeaderDropdownComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HeaderDropdownModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

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