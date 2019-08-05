import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService, AssetsResponse } from '@sdp-api';
import {  of, throwError } from 'rxjs';
import { OSVScenarios } from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('AssetsComponent', () => {
	let component: AssetsComponent;
	let fixture: ComponentFixture<AssetsComponent>;

	let osvService: OSVService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {	
		fixture = TestBed.createComponent(AssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call case list on init', () => {
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<AssetsResponse> OSVScenarios[4].scenarios.GET[0].response.body));
		expect(component.status.isLoading)
			.toBe(true);
		component.ngOnInit();
		fixture.detectChanges();	
		expect(osvService.getAssets)
			.toHaveBeenCalled();
		expect(component.assetsTable)
			.toBeDefined();	
		expect(component.status.isLoading)
			.toBe(false);
		expect(component.assetsTable)
			.toBeDefined();	
	});

	it('should should handle getAssets error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(component, 'buildTable');
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.detectChanges();	
		expect(osvService.getAssets)
			.toHaveBeenCalled();
		expect(component.assetsTable)
			.toBeUndefined();	
	});

	it('should refresh on sort', () => {
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<AssetsResponse> OSVScenarios[4].scenarios.GET[0].response.body));	
		component.ngOnInit();
		fixture.detectChanges();
		component.sortTable({
			key: 'Key1',
			value: 'Value1',
			sortable: true,
			sortDirection: 'asc'
		});
		
		fixture.detectChanges();
		expect(component.assetsParams.sort)
			.toEqual('Key1');
		expect(component.assetsParams.sortOrder)
			.toEqual('desc');	
		expect(component.assetsParams.pageIndex)
			.toEqual(1);	
		expect(osvService.getAssets)
			.toHaveBeenCalledTimes(2);
		component.sortTable({
			key: 'Key1',
			value: 'Value1',
			sortable: true,
			sortDirection: 'desc'
		});	
		fixture.detectChanges();
		expect(component.assetsParams.sortOrder)
			.toEqual('asc');
	});

	it('should refresh on page change', () => {
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<AssetsResponse> OSVScenarios[4].scenarios.GET[0].response.body));		
		component.onPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(component.assetsParams.pageIndex)
			.toEqual(3);
		expect(osvService.getAssets)
			.toHaveBeenCalled();
	});

	it('should select/deselect a case on row click', () => {
		component.assets = (<any> OSVScenarios[4].scenarios.GET[0].response.body).uiAssetList;
		const rowCase = (<any> OSVScenarios[4].scenarios.GET[0].response.body).uiAssetList[0];
		component.onRowSelect(rowCase);
		fixture.detectChanges();
		expect(component.selectedAsset)
			.toBe(rowCase);
		component.onRowSelect(rowCase);
		expect(component.selectedAsset)
			.toBeNull();
	});

	it('should refersh on filters change ', fakeAsync(() => {
		component.ngOnChanges({
			filters: {
				currentValue: {
					deploymentStatus: ['none', 'upgrade'],
					assetType: ['assets_profile'],
				},
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.assetsParams.filter)
			.toBe('deployment:none,upgrade;independent:no');
	}));

	it('should show pagination info if getAssets call is success', () => {
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<any>OSVScenarios[5].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getAssets)
			.toHaveBeenCalled();
		expect(component.paginationCount)
			.toBe('1-6');
	});

	it('should show pagination info if getAssets call is success', () => {
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<any>OSVScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getAssets)
			.toHaveBeenCalled();
		expect(component.paginationCount)
			.toBe('1-10');
		expect(component.assetsTable)
			.toBeDefined();
	});
});
