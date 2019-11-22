import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ChnagePasswordModule } from './change-password.module';
import { RegisterCollectorService } from '../../setup-ie/register-collector/register-collector.service';
import { SetupIEService } from '../../setup-ie/setup-ie.service';

describe('ChangePasswordComponent', () => {
	let component: ChangePasswordComponent;
	let fixture: ComponentFixture<ChangePasswordComponent>;
	let setupService: SetupIEService;
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
			],
		});
	});

	beforeEach(() => {
		setupService = TestBed.get(SetupIEService);
		registerService = TestBed.get(RegisterCollectorService);
		fixture = TestBed.createComponent(ChangePasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('Close resources', () => {
		component.ngOnDestroy();
		fixture.detectChanges();
	});

	it('Checks IP Connection', () => {
		spyOn(setupService, 'ping');
		fixture.detectChanges();
		expect(setupService.ping)
			.toHaveBeenCalled();
	});

	it('should continue', () => {
		component.onContinue();
		expect(component.isLoading)
			.toBeTruthy();
		expect(component.ipAddress)
			.toBeDefined();
	});

	it('Change password', () => {
		spyOn(registerService, 'changePassword');
		component.onSubmit();
		fixture.detectChanges();
		expect(registerService.changePassword)
			.toHaveBeenCalled();
	});

});
