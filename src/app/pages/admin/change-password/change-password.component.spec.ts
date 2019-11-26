import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangePasswordComponent } from './change-password.component';
import { environment } from '@environment';
import { ChnagePasswordModule } from './change-password.module';
import { RegisterCollectorService } from '../../setup-ie/register-collector/register-collector.service';
import { SetupIEService } from '../../setup-ie/setup-ie.service';
import { of } from 'rxjs';

describe('ChangePasswordComponent', () => {
	let component: ChangePasswordComponent;
	let fixture: ComponentFixture<ChangePasswordComponent>;
	let registerService: RegisterCollectorService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ChnagePasswordModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				SetupIEService,
				RegisterCollectorService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		registerService = TestBed.get(RegisterCollectorService);
		fixture = TestBed.createComponent(ChangePasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should set values', () => {
		component.accountForm.get('oldPassword')
			.setValue('Admin@1234');
		component.accountForm.get('password')
			.setValue('Admin@123');
		component.accountForm.get('passwordConf')
			.setValue('Admin@123');
	});

	it('should validate password', () => {
		const pwControl = component.accountForm.get('password');
		pwControl.setValue('a');
		fixture.detectChanges();
		expect(pwControl.valid)
			.toBe(false);
		expect(component.pwErrors)
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

	it('should validate password confirmation', () => {
		const pwControl = component.accountForm.get('password');
		const confControl = component.accountForm.get('passwordConf');
		pwControl.setValue('Admin@123');
		confControl.setValue('Admin@1234');
		fixture.detectChanges();
		expect(confControl.invalid)
			.toBe(true);
	});

	it('should change password', () => {
		const dummyData: String = 'Credential changed';
		spyOn(registerService, 'changePassword')
			.and
			.returnValue(of(<string> dummyData));
		component.onSubmit();
		fixture.detectChanges();
		expect(registerService.changePassword)
			.toHaveBeenCalled();
	});

	it('should not change password', () => {
		const dummyData = { staus : 400 };
		spyOn(registerService, 'changePassword')
			.and
			.returnValue(of(<any> dummyData));
		component.onSubmit();
		fixture.detectChanges();
		expect(registerService.changePassword)
			.toHaveBeenCalled();
		expect(component.isChangingPass)
			.toBeTruthy();
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
		expect(component.changePas)
			.toBeFalsy();
	});

	it('Open new tab', () => {
		component.openIpAddressInNewTab();
		expect(component.clickedProceed)
			.toBeTruthy();
	});

	it('shold change pass if certficate is present', () => {
		const dummyData = true;
		spyOn(component, 'checkIPConnection')
			.and
			.returnValue(of(<boolean> dummyData));
		component.onContinue();
		fixture.detectChanges();
		expect(component.checkIPConnection)
			.toHaveBeenCalled();
		expect(component.changePas)
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

});
