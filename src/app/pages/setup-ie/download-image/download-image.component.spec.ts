import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { ASDAPIService } from '@services';
import { of, throwError } from 'rxjs';

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
	let regSpy: jasmine.Spy;
	let getMetadataSpy: jasmine.Spy;
	let getDownloadUrlSpy: jasmine.Spy;
	let acceptEULASpy: jasmine.Spy;
	let acceptK9Spy: jasmine.Spy;
	let routerNavigateSpy: jasmine.Spy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DownloadImageModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
		asdService = TestBed.get(ASDAPIService);
		cpService = TestBed.get(ControlPointIERegistrationAPIService);
		router = TestBed.get(Router);
		regSpy = spyOn(cpService, 'createIERegistrationUsingPOST')
			.and
			.returnValue(of(null));
		getMetadataSpy = spyOn(asdService, 'getMetadata')
			.and
			.returnValue(of(ASDMetadataScenarios[0].scenarios.GET[0].response.body));
		getDownloadUrlSpy = spyOn(asdService, 'getDownloadURL')
			.and
			.returnValue(of(ASDImageDownloadUrlScenarios[0].scenarios.GET[0].response.body));
		acceptEULASpy = spyOn(asdService, 'acceptEULA')
			.and
			.returnValue(of(null));
		acceptK9Spy = spyOn(asdService, 'acceptK9')
			.and
			.returnValue(of(null));
		routerNavigateSpy = spyOn(router, 'navigate')
			.and
			.returnValue(Promise.resolve(null));
	}));

	beforeEach(() => {
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
		regSpy.and
			.returnValue(throwError(new HttpErrorResponse({
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
				expect()
					.nothing();
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
		tick(1000);
		expect(acceptEULASpy)
			.toHaveBeenCalled();
	}));

	it('should trigger view changes', () => {
		component.onDeclineK9();
		expect(component.didDecline)
			.toBe(true);
		component.cancelK9Decline();
		expect(component.view)
			.toBe('k9');
		component.confirmK9Decline();
		expect(routerNavigateSpy)
			.toHaveBeenCalled();
	});
});
