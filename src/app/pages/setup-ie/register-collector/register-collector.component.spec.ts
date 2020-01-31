import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { RegisterCollectorComponent } from './register-collector.component';
import { RegisterCollectorModule } from './register-collector.module';
import { environment } from '../../../../environments/environment';
import { SetupIEService } from '../setup-ie.service';
import { SetupIEStateService } from '../setup-ie-state.service';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { RegisterCollectorService } from './register-collector.service';

describe('RegisterCollectorComponent', () => {
	let component: RegisterCollectorComponent;
	let fixture: ComponentFixture<RegisterCollectorComponent>;
	let setupService: SetupIEService;
	let stateService: SetupIEStateService;
	let cpService: ControlPointIERegistrationAPIService;
	let registerService: RegisterCollectorService;
	let getRegSpy;
	let downloadSpy;
	let regSpy;
	let authTokenSpy;
	let getStatusSpy;
	const blob = new Blob;

	describe('with queryParams', () => {
		beforeEach((() => {
			TestBed.configureTestingModule({
				imports: [
					HttpClientTestingModule,
					RegisterCollectorModule,
					RouterTestingModule,
				],
				providers: [
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
					{ provide: ActivatedRoute, useValue: {
						params: of(null),
						queryParams: of(null),
						snapshot: {
							queryParams: { collectorIP: '127.0.0.1' },
						},
					}},
				],
			})
				.compileComponents();
			stateService = TestBed.get(SetupIEStateService);
			stateService.clearState();

			fixture = TestBed.createComponent(RegisterCollectorComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}));

		it('should create', () => {
			component.ngOnInit();
			fixture.detectChanges();
			expect(component)
				.toBeTruthy();
		});
	});

	describe('without queryParams', () => {
		beforeEach((() => {
			TestBed.configureTestingModule({
				imports: [
					HttpClientTestingModule,
					RegisterCollectorModule,
					RouterTestingModule,
				],
				providers: [
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
				],
			})
				.compileComponents();
			registerService = TestBed.get(RegisterCollectorService);
			setupService = TestBed.get(SetupIEService);
			stateService = TestBed.get(SetupIEStateService);
			stateService.clearState();
			cpService = TestBed.get(ControlPointIERegistrationAPIService);
			getRegSpy = jest.spyOn(cpService, 'getIERegistrationUsingGET')
				.mockReturnValue(of([{ registrationFileUrl: 'test' }]));
			downloadSpy = jest.spyOn(setupService, 'downloadFromUrl')
				.mockReturnValue(of(blob));
			regSpy = jest.spyOn(registerService, 'registerOnline')
				.mockReturnValue(of('token'));
			authTokenSpy = jest.spyOn(registerService, 'getAuthToken')
				.mockReturnValue(of('token'));
			getStatusSpy = jest.spyOn(registerService, 'getStatus')
				.mockReturnValue(of({ status: 'Pending' }));

			fixture = TestBed.createComponent(RegisterCollectorComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}));

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

		it('should download a registration file', () => {
			component.ngOnInit();
			fixture.detectChanges();
			expect(getRegSpy)
				.toHaveBeenCalled();
			expect(downloadSpy)
				.toHaveBeenCalled();

			getRegSpy.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
			})));
			component.ngOnInit();
			fixture.detectChanges();
			expect(getRegSpy)
				.toHaveBeenCalled();
			expect(component.error)
				.not
				.toBeNull();
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

		it('should register on Enter keypress', () => {
			component.keyEvent(<any> { keyCode: 0 });
			component.accountForm.get('oldPassword')
				.setValue('Admin@1234');
			component.accountForm.get('password')
				.setValue('Admin@123');
			component.accountForm.get('passwordConf')
				.setValue('Admin@123');
			component.loading = false;
			component.keyEvent(<any> { keyCode: 13 });
			fixture.detectChanges();
			expect(regSpy)
				.toHaveBeenCalled();
		});

		it('should get an auth token if device is already registered', () => {
			regSpy.mockReturnValue(of('Device is already register'));
			component.onSubmit();
			expect(regSpy)
				.toHaveBeenCalled();
			expect(authTokenSpy)
				.toHaveBeenCalled();
		});

		it('should poll for status', fakeAsync(() => {
			let counter1 = 0;
			const sub1 = component.pollStatus()
				.subscribe(() => {
					if (counter1 === 1) {
						sub1.unsubscribe();
					}
					counter1 += 1;
				});
			tick(10000);
			let counter2 = 0;
			getStatusSpy.mockReturnValue(of({ status: 'Registration Failed' }));
			const sub2 = component.pollStatus()
				.subscribe(() => {
					if (counter2 === 1) {
						sub2.unsubscribe();
					}
					counter2 += 1;
					expect(component.error)
						.toBeDefined();
				});
			tick(10000);
			let counter3 = 0;
			getStatusSpy.mockReturnValue(of({ status: 'Registered' }));
			const sub3 = component.pollStatus()
				.subscribe(() => {
					if (counter3 === 1) {
						sub3.unsubscribe();
					}
					counter3 += 1;
				});
			tick(10000);
		}));

		it('should catch registration error', () => {
			regSpy
				.mockReturnValue(throwError(new HttpErrorResponse({
					status: 404,
				})));
			component.onSubmit();
			fixture.detectChanges();
			expect(component.error)
				.toBeDefined();
		});

		it('should catch auth error', () => {
			regSpy.mockReturnValue(of('Device is already register'));
			authTokenSpy.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
			})));
			component.onSubmit();
			fixture.detectChanges();
			expect(component.error)
				.toBeDefined();
		});

	});
});
