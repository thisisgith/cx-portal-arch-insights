import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CgtRequestFormComponent } from './cgt-request-form.component';
import { CgtRequestFormModule } from './cgt-request-form.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AccRequestFormComponent', () => {
	let component: CgtRequestFormComponent;
	let fixture: ComponentFixture<CgtRequestFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CgtRequestFormModule,
				FormsModule,
				ReactiveFormsModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CgtRequestFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have invalid form when empty', () => {
		expect(component.requestForm.valid)
			.toBeFalsy();
	});
});
