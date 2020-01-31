import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SetupIEService } from '../setup-ie.service';
import { environment } from '../../../../environments/environment';
import { of, throwError } from 'rxjs';
import { ConnectDNACenterComponent } from './connect-dna-center.component';
import { ConnectDNACenterModule } from './connect-dna-center.module';
import { SetupIEStateService } from '../setup-ie-state.service';
import { RegisterCollectorService } from '../register-collector/register-collector.service';
import { CuiModalModule, CuiModalService } from '@cisco-ngx/cui-components';

describe('ConnectDNACenterComponent', () => {
	let component: ConnectDNACenterComponent;
	let fixture: ComponentFixture<ConnectDNACenterComponent>;
	let registerService: RegisterCollectorService;
	let setupService: SetupIEService;
	let stateService: SetupIEStateService;
	let modalService: CuiModalService;
	let dnacSpy;
	let registerSpy;
	let modalSpy;

	describe('without queryParams', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					ConnectDNACenterModule,
					HttpClientTestingModule,
					RouterTestingModule,
				],
				providers: [
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
				],
			})
			.compileComponents();
			localStorage.removeItem('cxportal.cisco.com::IE_SETUP_STATE');
			fixture = TestBed.createComponent(ConnectDNACenterComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component)
				.toBeTruthy();
		});
	});

	describe('with queryParams', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					ConnectDNACenterModule,
					CuiModalModule,
					HttpClientTestingModule,
					RouterTestingModule,
				],
				providers: [
					RegisterCollectorService,
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
					{ provide: ActivatedRoute, useValue: {
						params: of(null),
						queryParams: of({ fromAdmin : false }),
						snapshot: {
							queryParams: { collectorIP: '127.0.0.1' },
						},
					}},
				],
			})
			.compileComponents();
			registerService = TestBed.get(RegisterCollectorService);
			setupService = TestBed.get(SetupIEService);
			stateService = TestBed.get(SetupIEStateService);
			modalService = TestBed.get(CuiModalService);

			localStorage.removeItem('cxportal.cisco.com::IE_SETUP_STATE');
			dnacSpy = jest.spyOn(setupService, 'checkForDNAC')
				.mockReturnValue(of(true));
			registerSpy = jest.spyOn(registerService, 'installAndRegisterDNAC')
				.mockReturnValue(of(''));
			modalSpy = jest.spyOn(modalService, 'showComponent')
				.mockReturnValue(new Promise(resolve => resolve()));
			fixture = TestBed.createComponent(ConnectDNACenterComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should see collectorIP queryParam', () => {
			const state = stateService.getState();
			expect(state.collectorIP)
				.toBe('127.0.0.1');
		});

		it('should change route if no dnac', () => {
			dnacSpy.mockReturnValue(of(false));
			const sub = component.onStepComplete
				.subscribe(array => {
					sub.unsubscribe();
					expect(array.length)
						.toBe(1);
				});
			component.ngOnInit();
			fixture.detectChanges();
		});

		it('should register', () => {
			const sub = component.onStepComplete
				.subscribe(() => {
					sub.unsubscribe();
					expect(registerSpy)
						.toHaveBeenCalled();
				});
			component.onSubmit();
			fixture.detectChanges();
		});

		it('should go to next step on Enter keypress', () => {
			let sub = component.onStepComplete
				.subscribe(() => {
					expect.anything();
					sub.unsubscribe();
				});
			component.keyEvent(<any> { keyCode: 0 });
			component.keyEvent(<any> { keyCode: 13 });
			component.accountForm.get('ipAddress')
				.setValue('127.0.0.1');
			component.accountForm.get('username')
				.setValue('kbushnick');
			component.accountForm.get('password')
				.setValue('Admin@123');
			sub = component.onStepComplete
				.subscribe(() => {
					expect.anything();
					sub.unsubscribe();
				});
			component.keyEvent(<any> { keyCode: 13 });
		});

		it('should open a modal if registration call fails', () => {
			registerSpy.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
			const sub = component.onStepComplete
				.subscribe(() => {
					sub.unsubscribe();
					expect(modalSpy)
						.toHaveBeenCalled();
				});
			component.onSubmit();
			fixture.detectChanges();
		});
	});

});
