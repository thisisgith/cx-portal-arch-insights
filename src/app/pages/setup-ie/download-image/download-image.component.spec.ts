import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { ASDAPIService } from '@services';
import { of, throwError } from 'rxjs';
import { SetupIEStateService } from '../setup-ie-state.service';

import { DownloadImageComponent } from './download-image.component';
import { DownloadImageModule } from './download-image.module';
import { environment } from '../../../../environments/environment';
import { ASDImageDownloadUrlScenarios, ASDMetadataScenarios } from '@mock';

describe('DownloadImageComponent', () => {
	let component: DownloadImageComponent;
	let fixture: ComponentFixture<DownloadImageComponent>;
	let asdService: ASDAPIService;
	let cpService: ControlPointIERegistrationAPIService;
	let router: Router;
	let regSpy;
	let getMetadataSpy;
	let getDownloadUrlSpy;
	let acceptEULASpy;
	let acceptK9Spy;
	let routerNavigateSpy;
	let stateService: SetupIEStateService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				DownloadImageModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		asdService = TestBed.get(ASDAPIService);
		cpService = TestBed.get(ControlPointIERegistrationAPIService);
		router = TestBed.get(Router);
		regSpy = jest.spyOn(cpService, 'createIERegistrationUsingPOST')
			.mockReturnValue(of(null));
		getMetadataSpy = jest.spyOn(asdService, 'getMetadata')
			.mockReturnValue(of(ASDMetadataScenarios[0].scenarios.GET[0].response.body));
		getDownloadUrlSpy = jest.spyOn(asdService, 'getDownloadURL')
			.mockReturnValue(of(ASDImageDownloadUrlScenarios[0].scenarios.GET[0].response.body));
		acceptEULASpy = jest.spyOn(asdService, 'acceptEULA')
			.mockReturnValue(of(null));
		acceptK9Spy = jest.spyOn(asdService, 'acceptK9')
			.mockReturnValue(of(null));
		routerNavigateSpy = jest.spyOn(router, 'navigate')
			.mockReturnValue(Promise.resolve(null));
	}));

	beforeEach(() => {
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		stateService.setState({
			compKey: 1,
		});
		fixture = TestBed.createComponent(DownloadImageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should initialize', fakeAsync(() => {
		tick(1000);
		expect(getMetadataSpy)
			.toHaveBeenCalled();
		expect(getDownloadUrlSpy)
			.toHaveBeenCalled();
	}));

	it('should be disabled', () => {
		component.acceptedEULA = true;
		expect(component.isDisabled)
			.toBe(true);
		component.acceptedSE = true;
		expect(component.isDisabled)
			.toBe(true);
		component.businessFn = 'civ';
		expect(component.isDisabled)
			.toBe(false);
		component.businessFn = 'gov';
		expect(component.isDisabled)
			.toBe(true);
		component.inCountry = 'yes';
		expect(component.isDisabled)
			.toBe(false);
	});

	it('should show errors', () => {
		regSpy.mockReturnValue(throwError(new HttpErrorResponse({
			status: 404,
		})));
		component.onDownload();
		fixture.detectChanges();
		expect(regSpy)
			.toHaveBeenCalled();
		expect(component.error)
			.toBeDefined();
	});

	it('should continue', () => {
		const sub = component.onStepComplete
			.subscribe(() => {
				expect.anything();
				sub.unsubscribe();
			});
		component.continue();
	});

	it('should accept K9', fakeAsync(() => {
		component.onAcceptK9('civ');
		tick(1000);
		expect(acceptK9Spy)
			.toHaveBeenCalled();

	}));

	it('should accept EULA', fakeAsync(() => {
		component.acceptEULAAndDownload();
		tick(10000);
		expect(acceptEULASpy)
			.toHaveBeenCalled();
	}));

	it('should trigger view changes', () => {
		component.onDecline();
		expect(component.didDecline)
			.toBe(true);
		component.cancelK9Decline();
		expect(component.view)
			.toBe('k9');
		component.confirmK9Decline();
		expect(routerNavigateSpy)
			.toHaveBeenCalled();
	});

	it('should reset view', () => {
		stateService.setState({
			compKey: 3,
		});
		component.resetViews();
		expect(component.view)
		.toEqual('connect');
	});

	it('should download ova image', () => {
		component.commenceDownload();
		component.getDownloadURL()
			.subscribe(res => {
				expect(res)
				.toBeDefined();
			});
	});

	it('should call commenceDownload', () => {
		component.commenceDownload()
		.subscribe(res => {
			expect(res)
			.toBeDefined();
		});
	});
});
