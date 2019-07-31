import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsHeaderComponent } from './security-details-header.component';
import { SecurityDetailsHeaderModule } from './security-details-header.module';

describe('SecurityDetailsHeaderComponent', () => {
	let component: SecurityDetailsHeaderComponent;
	let fixture: ComponentFixture<SecurityDetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SecurityDetailsHeaderModule],
		})
		.compileComponents();
	}));

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
