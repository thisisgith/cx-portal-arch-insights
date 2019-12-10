import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDNACCredentialsComponent } from './change-dnac-credentials.component';
import { environment } from '@environment';
import { ChangeDNACCredentialsModule } from './change-dnac-credentials.module';
import { RegisterCollectorService } from '../../setup-ie/register-collector/register-collector.service';
import { SetupIEService } from '../../setup-ie/setup-ie.service';
import { of, throwError } from 'rxjs';
import {  Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('ChangePasswordComponent', () => {
	let component: ChangeDNACCredentialsComponent;
	let fixture: ComponentFixture<ChangeDNACCredentialsComponent>;
	let registerService: RegisterCollectorService;
	const mockRouter = {
		navigate: jasmine.createSpy('navigate'),
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ChangeDNACCredentialsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				SetupIEService,
				RegisterCollectorService,
				{ provide: 'ENVIRONMENT', useValue: environment },
				{ provide: Router, useValue: mockRouter },
			],
		});
	});

	beforeEach(() => {
		registerService = TestBed.get(RegisterCollectorService);
		fixture = TestBed.createComponent(ChangeDNACCredentialsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should set values', () => {
		component.credentialsForm.get('collectorPassword')
			.setValue('Admin@123');
		component.credentialsForm.get('DNACIpAddress')
			.setValue('1.1.1.1');
		component.credentialsForm.get('username')
			.setValue('admin');
		component.credentialsForm.get('password')
			.setValue('Admin@1234');
	});

	it('should validate password', () => {
		const pwControl = component.credentialsForm.get('collectorPassword');
		pwControl.setValue('a');
		fixture.detectChanges();
		expect(pwControl.valid)
			.toBe(false);
		expect(component.CollPwErrors)
			.not
			.toBeNull();
		pwControl.setValue('1');
		fixture.detectChanges();
		expect(pwControl.valid)
			.toBe(false);
		pwControl.setValue('Admin@123');
		fixture.detectChanges();
		expect(pwControl.valid)
			.toBe(true);
	});

	it('should change credentials', () => {
		const dummyData: String = 'Configurations updated.';
		spyOn(registerService, 'changeDNACCredentials')
			.and
			.returnValue(of(<string> dummyData));
		component.changeCredentials();
		fixture.detectChanges();
		expect(registerService.changeDNACCredentials)
			.toHaveBeenCalled();
		expect(component.isChangingCred)
			.toBeTruthy();
	});

	it('should not change credentials', () => {
		const dummyData = '"{ staus : 400 }"';
		spyOn(registerService, 'changeDNACCredentials')
			.and
			.returnValue(of(<string> dummyData));
		component.changeCredentials();
		fixture.detectChanges();
		expect(registerService.changeDNACCredentials)
			.toHaveBeenCalled();
		expect(component.isChangingCred)
			.toBeFalsy();
	});

	it('should get Auth Token', () => {
		const dummyData = 'tokenDummy';
		spyOn(registerService, 'getAuthTokenDayN')
			.and
			.returnValue(of(<string> dummyData));
		component.onSubmit();
		fixture.detectChanges();
		expect(registerService.getAuthTokenDayN)
			.toHaveBeenCalled();
	});

	it('should not get Auth Token', () => {
		const dummyData = { status: 400 };
		spyOn(registerService, 'getAuthTokenDayN')
			.and
			.returnValue(of(<any> dummyData));
		component.onSubmit();
		fixture.detectChanges();
		expect(registerService.getAuthTokenDayN)
			.toHaveBeenCalled();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('Close resources', () => {
		component.ngOnDestroy();
		fixture.detectChanges();
	});

	it('should continue with certificate', () => {
		component.onContinue();
		expect(component.isLoading)
			.toBeTruthy();
		expect(component.ipAddress)
			.toBeDefined();
		expect(component.changeCred)
			.toBeFalsy();
	});

	it('Open new tab', () => {
		component.openIpAddressInNewTab();
		expect(component.clickedProceed)
			.toBeTruthy();
	});

	it('shold change credentials if certficate is present', () => {
		const dummyData = true;
		spyOn(component, 'checkIPConnection')
			.and
			.returnValue(of(<boolean> dummyData));
		component.onContinue();
		fixture.detectChanges();
		expect(component.checkIPConnection)
			.toHaveBeenCalled();
		expect(component.changeCred)
			.toBeTruthy();
	});

	it('shold instruct if certficate is not present', () => {
		const dummyData = false;
		spyOn(component, 'checkIPConnection')
			.and
			.returnValue(of(<boolean> dummyData));
		component.onContinue();
		fixture.detectChanges();
		expect(component.checkIPConnection)
			.toHaveBeenCalled();
		expect(component.instruct)
			.toBeTruthy();
	});

	it('shold redirect to admin setting', () => {
		  component.onConfirm();
		  expect(mockRouter.navigate)
		  	.toHaveBeenCalledWith(['/admin']);
	});

	it('should handle api failure ', fakeAsync(() => {

		spyOn(registerService, 'changePassword').and
		.returnValue(throwError(new HttpErrorResponse({ status: 400,
			statusText: 'Resource not found',
		})));
		component.onSubmit();
		registerService.changeDNACCredentials([{
			type: 'dnac',
			ipAddress: '1.1.1.1',
			password: 'admin@1234',
			username: 'admnin',
		}], '127.0.0.1', 'tokendummy')
		.subscribe(null, err => {
			expect(err.statusText)
				.toEqual('Resource not found');
		});
	}));
});
