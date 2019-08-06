import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { UtilsService } from '@services';
import { of, throwError } from 'rxjs';

import { DownloadImageComponent } from './download-image.component';
import { DownloadImageModule } from './download-image.module';
import { environment } from '../../../../environments/environment';

describe('DownloadImageComponent', () => {
	let component: DownloadImageComponent;
	let fixture: ComponentFixture<DownloadImageComponent>;
	let cpService: ControlPointIERegistrationAPIService;
	let utils: UtilsService;
	let regSpy: jasmine.Spy;
	let downloadSpy: jasmine.Spy;

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
		cpService = TestBed.get(ControlPointIERegistrationAPIService);
		utils = TestBed.get(UtilsService);
		regSpy = spyOn(cpService, 'createIERegistrationUsingPOST')
			.and
			.returnValue(of(null));
		downloadSpy = spyOn(utils, 'download')
			.and
			.returnValue(null);
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

	it('should download', () => {
		component.onDownload();
		expect(regSpy)
			.toHaveBeenCalled();
		expect(downloadSpy)
			.toHaveBeenCalled();
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
			.toBe(true);
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
});
