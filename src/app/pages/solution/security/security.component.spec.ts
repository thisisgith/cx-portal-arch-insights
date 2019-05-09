import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { SecurityModule } from './security.module';

describe('SecurityComponent', () => {
	let component: SecurityComponent;
	let fixture: ComponentFixture<SecurityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SecurityModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecurityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
