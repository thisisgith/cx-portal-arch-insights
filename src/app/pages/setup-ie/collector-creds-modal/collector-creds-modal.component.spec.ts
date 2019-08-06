import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CollectorCredsModalComponent } from './collector-creds-modal.component';
import { AlertModule } from '@components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '../../../../environments/environment';
import { of, throwError } from 'rxjs';
import { CuiModalService } from '@cisco-ngx/cui-components';

import { RegisterCollectorService } from '../register-collector/register-collector.service';

describe('CollectorCredsModalComponent', () => {
	let component: CollectorCredsModalComponent;
	let fixture: ComponentFixture<CollectorCredsModalComponent>;
	let registerService: RegisterCollectorService;
	let modalService: CuiModalService;
	let getAuthSpy: jasmine.Spy;
	let modalHideSpy: jasmine.Spy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CollectorCredsModalComponent],
			imports: [
				AlertModule,
				HttpClientTestingModule,
				I18nPipeModule,
				ReactiveFormsModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
		registerService = TestBed.get(RegisterCollectorService);
		modalService = TestBed.get(CuiModalService);
		getAuthSpy = spyOn(registerService, 'getAuthToken')
			.and
			.returnValue(of('token'));
		modalHideSpy = spyOn(modalService, 'hide');
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CollectorCredsModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should close', () => {
		component.close();
		expect(modalHideSpy)
			.toHaveBeenCalled();
	});

	it('should get new auth token', () => {
		component.credsForm.get('password')
			.setValue('Admin@123');
		component.continue();
		expect(getAuthSpy)
			.toHaveBeenCalled();
	});

	it('should show error when auth call fails', () => {
		getAuthSpy.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
			})));
		component.credsForm.get('password')
			.setValue('Admin@123');
		component.continue();
		expect(component.error)
			.toBe(true);
	});
});
