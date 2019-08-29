import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailsComponent } from './asset-detail.component';
import { AssetDetailsModule } from './asset-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OSVScenarios } from '@mock';
import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';

fdescribe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;

	let osvService: OSVService;
	let selectedAsset;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
		selectedAsset = (<any> OSVScenarios[4].scenarios.GET[0].response.body).uiAssetList[0];
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
		component.selectedAsset = selectedAsset;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should not call fetchAssetsDetails if there is no selected asset', () => {
		spyOn(osvService, 'getAssetDetails');
		component.selectedAsset = undefined;
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getAssetDetails)
			.toHaveBeenCalledTimes(0);
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'getAssetDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.selectedAsset = <any> OSVScenarios[4].scenarios.GET[0].response.body;
		expect(component.status.isLoading)
			.toBe(true);
		component.ngOnInit();
		expect(component.assetDetails)
			.toBe(null);
		expect(component.status.isLoading)
			.toBe(false);
		expect(component.assetDetailsTable)
			.toBeUndefined();
	});

	xit('should return asset recommendations on success', () => {
		spyOn(component, 'buildTable');
		spyOn(component, 'sortData');
		spyOn(osvService, 'getAssetDetails')
			.and
			.returnValue(of(<any> OSVScenarios[3].scenarios.GET[0].response.body));
		component.selectedAsset = (<any> OSVScenarios[4].scenarios.GET[0].response.body)
									.uiAssetList[0];
		component.ngOnInit();
		expect(component.assetDetails)
			.toBeDefined();
		expect(component.buildTable)
			.toHaveBeenCalled();
		expect(component.assetDetailsParams.id.length)
			.toBeGreaterThan(0);
		expect(component.sortData)
			.toHaveBeenCalled();
	});

	it('should build Table on success', () => {
		spyOn(osvService, 'getAssetDetails')
			.and
			.returnValue(of(<any> OSVScenarios[3].scenarios.GET[0].response.body));
		component.selectedAsset = (<any> OSVScenarios[4].scenarios.GET[0].response.body)
									.uiAssetList[0];
		component.ngOnInit();
		expect(component.assetDetailsTable)
			.toBeDefined();
	});

	xit('sort data based on recommendation dates', () => {
		const data = _.cloneDeep(<any> OSVScenarios[3].scenarios.GET[0].response.body);
		component.sortData(data);
		expect(data[0].name)
			.toEqual('latest');
		expect(data[1].name)
			.toEqual('suggested');
		expect(data[2].name)
			.toEqual('current');
	});

	it('should build table only if we get recommendations', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(component, 'buildTable');
		spyOn(osvService, 'getAssetDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.fetchAssetDetails();
		fixture.detectChanges();
		expect(component.buildTable)
			.toHaveBeenCalledTimes(0);
	});

	it('table to be default view', () => {
		expect(component.view)
			.toBe('list');
	});

	it('refresh if the selecteAsset is changed', () => {
		spyOn(component, 'refresh');
		component.ngOnChanges({
			selecteAsset: {
				currentValue: true,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.refresh)
			.toHaveBeenCalled();
	});

	it('should reset the assetDetails on clear', () => {
		spyOn(osvService, 'getAssetDetails')
			.and
			.returnValue(of(<any> OSVScenarios[3].scenarios.GET[0].response.body));
		component.selectedAsset = <any> OSVScenarios[4].scenarios.GET[0].response.body;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.assetDetails)
			.toBeDefined();
		component.clear();
		expect(component.assetDetails)
			.toBeNull();
	});
});
