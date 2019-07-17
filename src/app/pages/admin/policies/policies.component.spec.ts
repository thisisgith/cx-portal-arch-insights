import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesComponent } from './policies.component';
import { PoliciesModule } from './policies.module';

describe('PoliciesComponent', () => {
	let component: PoliciesComponent;
	let fixture: ComponentFixture<PoliciesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [PoliciesModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PoliciesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
