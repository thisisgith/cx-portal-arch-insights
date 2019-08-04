import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { AssetsModule } from './assets.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService, AssetsResponse } from '@sdp-api';
import {  of } from 'rxjs';
import { OSVScenarios } from '@mock';

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
		spyOn(osvService, 'getAssets')
			.and
			.returnValue(of(<AssetsResponse> OSVScenarios[4].scenarios.GET[0].response.body));
		fixture = TestBed.createComponent(AssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call case list on init', () => {
		expect(osvService.getAssets)
			.toHaveBeenCalled();
	});

	it('should refresh on sort', () => {
		component.sortTable({
			key: 'Key1',
			value: 'Value1',
			sortable: true,
		});
		expect(osvService.getAssets)
			.toHaveBeenCalledTimes(2);
	});

	it('should refresh on page change', () => {
		component.onPageChanged({ page: 2 });
		expect(osvService.getAssets)
			.toHaveBeenCalledTimes(2);
	});

	it('should select a case on row click', fakeAsync(() => {
		const rowCase = (<any> OSVScenarios[4].scenarios.GET[0].response.body).uiAssetList[0];
		component.onRowSelect(rowCase);
		tick();
		fixture.detectChanges();
		expect(component.selectedAsset)
			.toBe(rowCase);
	}));

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
			.toBe('deployment:"none,upgrade";independent:no');
	}));
});
