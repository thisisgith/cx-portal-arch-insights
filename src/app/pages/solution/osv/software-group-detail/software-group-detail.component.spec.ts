import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { SoftwareGroupDetailModule } from './software-group-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService } from '@sdp-api';
import { OSVScenarios } from '@mock';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
describe('SoftwareGroupDetailComponent', () => {
	let component: SoftwareGroupDetailComponent;
	let fixture: ComponentFixture<SoftwareGroupDetailComponent>;
	let osvService: OSVService;

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
		jest.spyOn(osvService, 'getSoftwareGroupAssets')
			.mockReturnValue(of(sgAssets));
		jest.spyOn(osvService, 'getSoftwareGroupVersions')
			.mockReturnValue(of(sgVersions));
		jest.spyOn(osvService, 'getSoftwareGroupRecommendations')
			.mockReturnValue(of(sgRecommendations));
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
		jest.spyOn(osvService, 'getSoftwareGroupAssets')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(osvService, 'getSoftwareGroupVersions')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		jest.spyOn(osvService, 'getSoftwareGroupRecommendations')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
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
		jest.spyOn(osvService, 'getSoftwareGroupAssets')
			.mockReturnValue(of(<any> OSVScenarios[7].scenarios.GET[0].response.body));
		jest.spyOn(osvService, 'getSoftwareGroupVersions')
			.mockReturnValue(of(<any> OSVScenarios[8].scenarios.GET[0].response.body));
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
		jest.spyOn(osvService, 'getSoftwareGroupVersions')
			.mockReturnValue(of());
		component.onVersionsPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupVersions)
			.toHaveBeenCalled();
		expect(component.softwareGroupVersionsParams.pageIndex)
			.toBe(3);
	});

	it('should refresh assets on page change', () => {
		jest.spyOn(osvService, 'getSoftwareGroupAssets')
			.mockReturnValue(of());
		component.onAssetsPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupAssets)
			.toHaveBeenCalled();
		expect(component.softwareGroupAssetsParams.pageIndex)
			.toBe(3);
	});

	it('should trigger onAccept or onCancel actions', () => {
		jest.spyOn(component, 'onAccept')
			.mockReturnThis();
		jest.spyOn(component, 'onCancel')
			.mockReturnThis();
		component.onAction({ type: 'accept', version: '1.1' });
		fixture.detectChanges();
		expect(component.onAccept)
			.toHaveBeenCalled();

		component.onAction({ type: 'cancel', version: '1.1' });
		fixture.detectChanges();
		expect(component.onCancel)
			.toHaveBeenCalled();

	});

});
