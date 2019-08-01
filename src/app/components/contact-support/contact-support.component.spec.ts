import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupportComponent } from './contact-support.component';
import { ContactSupportModule } from './contact-support.module';

describe('ContactSupportComponent', () => {
	let component: ContactSupportComponent;
	let fixture: ComponentFixture<ContactSupportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ContactSupportModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactSupportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
