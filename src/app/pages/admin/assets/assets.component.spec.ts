import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminAssetsComponent } from './assets.component';
import { AdminAssetsModule } from './assets.module';
import { AssetsState } from './assets-state.service';
import { of, throwError } from 'rxjs';

import { ControlPointDeviceDiscoveryAPIService } from '@sdp-api';
import { ControlpointAssetsScenarios } from '@mock';

describe('AdminAssetsComponent', () => {
	let component: AdminAssetsComponent;
	let fixture: ComponentFixture<AdminAssetsComponent>;
	let api: ControlPointDeviceDiscoveryAPIService;
	let getAssetsSpy: jasmine.Spy;
	let state: AssetsState;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AdminAssetsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();

		api = TestBed.get(ControlPointDeviceDiscoveryAPIService);
		state = TestBed.get(AssetsState);
		getAssetsSpy = spyOn(api, 'getDevicesUsingGET')
			.and
			.returnValue(of(ControlpointAssetsScenarios[0].scenarios.GET[0].response.body));
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should get assets on init', fakeAsync(() => {
		component.ngAfterViewInit();
		tick(1000);
		expect(getAssetsSpy)
			.toHaveBeenCalled();
	}));

	it('should set loading status to false on error', fakeAsync(() => {
		getAssetsSpy.and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
			})));
		component.ngAfterViewInit();
		tick(1000);
		expect(state.isLoadingAssets)
			.toBe(false);
	}));

	it('should update the page', fakeAsync(() => {
		component.onPageChanged({ page: 2 });
		expect(state.page)
			.toBe(3);
	}));
});
