import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelConfirmComponent } from './cancel-confirm.component';
import { CancelConfirmModule } from './cancel-confirm.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CuiModalService } from '@cisco-ngx/cui-components';

describe('CancelConfirmComponent', () => {
	let component: CancelConfirmComponent;
	let fixture: ComponentFixture<CancelConfirmComponent>;
	let cuiModalService: CuiModalService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CancelConfirmModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		cuiModalService = TestBed.get(CuiModalService);
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

	it('should remove the pop on cancel', () => {
		spyOn(cuiModalService, 'pop');
		component.back();
		expect(cuiModalService.pop)
			.toHaveBeenCalled();
	});

	it('should emit onCancel on continue', () => {
		spyOn(cuiModalService.onCancel, 'next');
		component.close();
		expect(cuiModalService.onCancel.next)
			.toHaveBeenCalled();
	});
});
