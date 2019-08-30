import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelConfirmComponent } from './cancel-confirm.component';
import { CancelConfirmModule } from './cancel-confirm.module';

describe('CancelConfirmComponent', () => {
	let component: CancelConfirmComponent;
	let fixture: ComponentFixture<CancelConfirmComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CancelConfirmModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CancelConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
