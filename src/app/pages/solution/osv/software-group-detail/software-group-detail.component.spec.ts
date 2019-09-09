import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { SoftwareGroupDetailModule } from './software-group-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService } from '@sdp-api';
import { OSVScenarios } from '@mock';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CuiModalService } from '@cisco-ngx/cui-components';

describe('SoftwareGroupDetailComponent', () => {
	let component: SoftwareGroupDetailComponent;
	let fixture: ComponentFixture<SoftwareGroupDetailComponent>;
	let osvService: OSVService;
	let cuiModalService: CuiModalService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupDetailModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
		cuiModalService = TestBed.get(CuiModalService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should load softwaregroup asset and versions', () => {
		const sgAssets = <any> OSVScenarios[7].scenarios.GET[0].response.body;
		const sgVersions = <any> OSVScenarios[8].scenarios.GET[0].response.body;
		const sgRecommendations = <any> OSVScenarios[9].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(sgAssets));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(sgVersions));
		spyOn(osvService, 'getSoftwareGroupRecommendations')
			.and
			.returnValue(of(sgRecommendations));
		const selectedSG = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSG;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroupAssets)
			.toBeDefined();
		expect(component.softwareGroupVersions)
			.toBeDefined();
		expect(component.machineRecommendations)
			.toBeDefined();
		expect(component.recommendations)
			.toBeDefined();
		expect(component.softwareGroupAssetsTable)
			.toBeDefined();
		expect(component.softwareGroupVersionsTable)
			.toBeDefined();
	});

	it('should handle  softwaregroup asset and versions error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(osvService, 'getSoftwareGroupRecommendations')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		const selectedSG = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSG;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroupAssets)
			.toBeNull();
		expect(component.softwareGroupVersions)
			.toBeNull();
		expect(component.machineRecommendations)
			.toBeNull();
		expect(component.recommendations)
			.toBeNull();
		expect(component.softwareGroupAssetsTable)
			.toBeUndefined();
		expect(component.softwareGroupVersionsTable)
			.toBeUndefined();
	});

	it('should reload softwaregroup assets and version on ngOnChanges', () => {
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(<any> OSVScenarios[7].scenarios.GET[0].response.body));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(<any> OSVScenarios[8].scenarios.GET[0].response.body));
		const selectedSG = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSG;
		component.ngOnChanges({
			selectedSoftwareGroup: {
				currentValue: selectedSG,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupAssets)
			.toHaveBeenCalled();
		expect(osvService.getSoftwareGroupVersions)
			.toHaveBeenCalled();
	});

	it('should set the tabIndex on ngOnChanges', () => {
		component.ngOnChanges({
			tabIndex: {
				currentValue: undefined,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		});
		fixture.detectChanges();
		expect(component.tabIndex)
			.toEqual(0);
		component.ngOnChanges({
			tabIndex: {
				currentValue: 2,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		});
		fixture.detectChanges();
		expect(component.tabIndex)
			.toEqual(2);
	});

	it('should refresh versions on page change', () => {
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of());
		component.onVersionsPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupVersions)
			.toHaveBeenCalled();
		expect(component.softwareGroupVersionsParams.pageIndex)
			.toBe(3);
	});

	it('should refresh assets on page change', () => {
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of());
		component.onAssetsPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupAssets)
			.toHaveBeenCalled();
		expect(component.softwareGroupAssetsParams.pageIndex)
			.toBe(3);
	});

	it('should trigger onAccept or onCancel actions', () => {
		spyOn(component, 'onAccept');
		spyOn(cuiModalService, 'showComponent');
		component.onAction({ type: 'accept', version: '1.1' });
		fixture.detectChanges();
		expect(component.onAccept)
			.toHaveBeenCalled();

		component.onAction({ type: 'cancel', version: '1.1' });
		fixture.detectChanges();
		expect(cuiModalService.showComponent)
			.toHaveBeenCalled();

	});

});
