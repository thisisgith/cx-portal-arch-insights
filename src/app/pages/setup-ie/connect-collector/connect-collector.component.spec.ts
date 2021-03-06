import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConnectCollectorComponent } from './connect-collector.component';
import { ConnectCollectorModule } from './connect-collector.module';
import { SetupIEService } from '../setup-ie.service';
import { SetupIEStateService } from '../setup-ie-state.service';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';

import { environment } from '../../../../environments/environment';

describe('ConnectCollectorComponent', () => {
	let component: ConnectCollectorComponent;
	let fixture: ComponentFixture<ConnectCollectorComponent>;
	let setupService: SetupIEService;
	let pingSpy;
	let stateService: SetupIEStateService;

	const setupSpies = () => {
		pingSpy = jest.spyOn(setupService, 'ping')
			.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
	};

	/**
	 * Restore spies
	 */
	const restoreSpies = () => {
		_.invoke(pingSpy, 'restore');
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ConnectCollectorModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				SetupIEService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		stateService.setState({
			collectorIP: '127.0.0.1',
		});

		setupService = TestBed.get(SetupIEService);
		setupSpies();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConnectCollectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should fail IP Address validation', () => {
		component.accountForm.get('ipAddress')
			.setValue('1324.1234.1.1234.1234');
		fixture.detectChanges();
		expect(component.accountForm.invalid)
			.toBe(true);
		component.accountForm.get('ipAddress')
			.setValue('1.1.1.256');
		fixture.detectChanges();
		expect(component.accountForm.invalid)
			.toBe(true);
	});

	it('should try to connect to cx collector', () => {
		component.accountForm.get('ipAddress')
			.setValue('127.0.0.1');
		component.onSubmit();
		fixture.detectChanges();
		expect(component.view)
			.toBe('connecting');
	});

	it('should move to next step when connected', fakeAsync(() => {
		const sub = component.onStepComplete
			.subscribe(() => {
				sub.unsubscribe();
				expect.anything();
			});
		restoreSpies();
		pingSpy.mockReturnValue(of(''));
		component.accountForm.get('ipAddress')
			.setValue('127.0.0.1');
		component.onSubmit();
		fixture.detectChanges();
	}));

	it('should attempt to poll for a 200', fakeAsync(() => {
		const sub = component.onStepComplete
			.subscribe(() => {
				sub.unsubscribe();
				alert('here');
				expect.anything();
			});
		component.accountForm.get('ipAddress')
			.setValue('127.0.0.1');
		component.onSubmit();
		fixture.detectChanges();
		pingSpy.mockReturnValue(of(''));
		tick(2001);

	}));

});
