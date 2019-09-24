import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RccComponent } from './rcc.component';
import { RccModule } from './rcc.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { user, ComplianceScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { RccService, Filter } from '@sdp-api';
import { FormBuilder, FormControl } from '@angular/forms';
import { AssetPanelLinkService } from '@services';

describe('RccComponent', () => {
	let component: RccComponent;
	let fixture: ComponentFixture<RccComponent>;
	let rccService: RccService;
	let assetPanelLinkService: AssetPanelLinkService;
	const mockFilter: Filter = Object.create({ });
	const formBuilder: FormBuilder = new FormBuilder();

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				RccModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{ provide: FormBuilder, useValue: formBuilder },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {
		rccService = TestBed.get(RccService);
		assetPanelLinkService = TestBed.get(AssetPanelLinkService);
	}));

	beforeEach(() => {
		window.sessionStorage.clear();
		fixture = TestBed.createComponent(RccComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	/**
	 * @TODO: modify test to use UI
	 */
	it('should get the violation grid data success', () => {
		spyOn(rccService, 'getGridData')
			.and
			.returnValue(of(ComplianceScenarios[0].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.tableData)
					.toBeDefined();
				expect(component.tableData)
					.toEqual(ComplianceScenarios[0].scenarios.GET[0].response.body);
			});
	});

	it('Should return the violation filter data', () => {
		spyOn(rccService, 'getViolationCount')
			.and
			.returnValue(of(ComplianceScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.filterObj)
					.toBeDefined();
			});
	});

	it('Should return the asset filter data', () => {
		spyOn(rccService, 'getAssetCount')
			.and
			.returnValue(of(ComplianceScenarios[5].scenarios.GET[0].response.body));
		component.selectedAssetView(component.view);
		fixture.detectChanges();
		expect(component.assetFilterObj)
			.toBeDefined();
	});

	it('should fetch selected row details on click of violation grid row', () => {
		const violationInfo = { };
		component.onViolationRowClicked(violationInfo);
		expect(component.selectedViolationModal)
			.toBeTruthy();
	});

	it('should fetch selected row details on click of asset grid row', () => {
		const assetInfo = { };
		component.onAssetRowClicked(assetInfo);
		expect(component.selectedAssetModal)
			.toBeTruthy();
	});

	it('on violation grid pagination selection', () => {
		const pageInfo = { };
		component.onPagerUpdated(pageInfo);
		expect(component.tableConfig)
			.toBeTruthy();
	});

	it('on asset grid pagination selection', () => {
		const pageInfo = { };
		component.onAssetPagerUpdated(pageInfo);
		expect(component.tableConfig)
			.toBeTruthy();
	});

	it('on asset view selection', () => {
		const view = 'asset';
		component.selectedAssetView(view);
		fixture.detectChanges();
		expect(component.tableConfig)
			.toBeTruthy();
		component.selectedView(view);
		expect(component.selectedView)
				.toBeTruthy();
	});

	it('should open violation view', () => {
		const view = 'violation';
		component.selectedView(view);
		expect(component.isAssetView)
			.toBeFalsy();
	});

	it('should clear all the selected filters', () => {
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}, {
			filter: 'osType',
			label: 'string',
			selected: false,
			value: 13,
		}];
		component.filters[0].seriesData = mockFilter.seriesData;
		component.clearFilters();
		expect(component.filters[0].seriesData[0].selected)
			.toBeFalsy();
	});

	it('should search in violation grid data success', () => {
		const tableCofig = {
			tableLimit: 10,
			tableOffset: 0,
			totalItems: 0,
		};
		const event = {
			keyCode: 13,
		};
		component.searchInput = '';
		component.searchViolations(event, 'clear');
		expect(event.keyCode)
			.toEqual(13);
		expect(component.violationGridObj.search)
			.toEqual(component.searchInput);
		expect(component.tableConfig)
			.toEqual(tableCofig);
	});

	it('should search in violation grid data failure', () => {
		const keyCode = 11;
		component.searchViolations(keyCode, null);
		expect(component.violationGridObj.search)
			.toBeFalsy();
	});

	it('should invoke clearSearchInput method empty', () => {
		component.searchInput = '';
		spyOn(component, 'searchViolations');
		component.clearSearchInput();
		fixture.detectChanges();
		expect(component.searchViolations)
			.toHaveBeenCalled();
	});

	it('should invoke clearSearchInput method with search input', () => {
		component.searchInput = 'Test';
		spyOn(component, 'searchViolations');
		component.clearSearchInput();
		fixture.detectChanges();
		expect(component.searchViolations)
			.toHaveBeenCalledTimes(0);
	});

	it('should open the slider', () => {
		const selData = { };
		component.openSlider(selData);
		expect(component.selectedAsset)
			.toBeTruthy();
	});

	it('should close the panel', () => {
		const model = 'selectedModel';
		component[model] = false;
		component.onPanelClose(model);
		expect(component[model])
			.toEqual(null);
	});

	it('should call openDevicePage', () => {
		const serialNumber = 'sn232';
		component.openDevicePage(serialNumber);
		expect(component.openDeviceModal)
			.toBeTruthy();
	});

	it('should get the selected sub filters list', () => {
		const key = '';
		component.getSelectedSubFilters(key);
		expect(component.filters)
			.toBeTruthy();
	});

	it('should get the selected sub filters list with key', () => {
		const key = 'policyGroup';
		expect(component.getSelectedSubFilters(key))
			.toEqual([]);
	});

	it('Should invoke onTableSortingChanged and assign tableOffset to 0', () => {
		component.onTableSortingChanged();
		expect(component.tableConfig.tableOffset)
			.toBe(0);
	});

	it('Should invoke onViolationTableSortingChanged and to reset table params', () => {
		const render = (item:any) => {
			if (typeof (item[this.key]) !== 'undefined' && item[this.key] !== null) {
				return item[this.key].toString();
			}
		};
		const columnData = {
			render,
			hidden: false,
			key: 'policyname',
			name: 'Policy Name',
			overflow: false,
			renderHTML: false,
			sortable: true,
			sortDirection: 'asc',
			sorting: true,
			sortKey: 'deviceid',
			width: 'auto',
		};
		component.onViolationTableSortingChanged(columnData);
		expect(component.tableConfig.tableOffset)
			.toBe(0);
		expect(component.violationGridObj.pageIndex)
			.toBe(1);
		expect(component.violationGridObj.sortName)
			.toEqual(columnData.key);
		expect(component.violationGridObj.sortOrder)
			.toEqual(columnData.sortDirection);
	});

	it('should call onSubfilterSelect on graph trigger', () => {
		mockFilter.key = 'policyGroup';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'policyGroup',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('policyGroup', mockFilter, true);
		fixture.detectChanges();
		expect(component.loading)
			.toBeTruthy();
	});

	it('should clear the filters on clear filters click', () => {
		mockFilter.key = 'severity';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('severity', mockFilter, true);
		fixture.detectChanges();
		expect(component.loading)
			.toBeTruthy();
	});

	it('should invoke with severity filter selected value', () => {
		mockFilter.key = 'severity';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('severity', mockFilter, true);
		fixture.detectChanges();
		expect(component.violationGridObj.severity)
			.toEqual(mockFilter.seriesData[0].filter);
	});

	it('should invoke with severity filter value null', () => {
		mockFilter.key = 'severity';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}, {
			filter: 'osType',
			label: 'string',
			selected: false,
			value: 13,
		}];
		component.filters[0].selected = true;
		component.filters[0].seriesData = mockFilter.seriesData;
		fixture.detectChanges();
		component.onSubfilterSelect('severity', mockFilter, false);
		fixture.detectChanges();
		expect(component.violationGridObj.severity)
			.toBeNull();
	});

	it('should invoke with assetOsType filter selected value', () => {
		mockFilter.key = 'assetOsType';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'assetOsType',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('assetOsType', mockFilter, true);
		fixture.detectChanges();
		expect(component.assetGridObj.osType)
			.toEqual(mockFilter.seriesData[0].filter);
	});

	it('should invoke with assetOsType filter value null', () => {
		mockFilter.key = 'assetOsType';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'assetOsType',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('assetOsType', mockFilter, false);
		fixture.detectChanges();
		expect(component.assetGridObj.osType)
			.toBeNull();
	});

	it('should invoke with assetSeverity filter selected value', () => {
		mockFilter.key = 'assetSeverity';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'assetSeverity',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('assetSeverity', mockFilter, true);
		fixture.detectChanges();
		expect(component.assetGridObj.severity)
			.toEqual(mockFilter.seriesData[0].filter);
		component.onSubfilterSelect('assetSeverity', mockFilter, false);
		fixture.detectChanges();
		expect(component.assetGridObj.severity)
			.toBeNull();
	});

	it('should invoke with others filter selected value', () => {
		mockFilter.key = 'others';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('others', mockFilter, true);
		fixture.detectChanges();
		expect(component.tableConfig.tableOffset)
			.toEqual(0);
		component.searchInput = 'a';
		component.onSubfilterSelect('others', mockFilter, false);
		fixture.detectChanges();
		expect(component.invalidSearchInput)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8', () => {
		component.searched = false;
		component.searchForm = formBuilder.group({
			search: null,
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, 'clear');
		expect(component.searched)
			.toBeFalsy();
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeFalsy();
	});

	it('should invoke searchViolations with keycode 13', () => {
		component.searched = false;
		component.searchInput = 'P';
		component.searchForm = formBuilder.group({
			search: 'PCI',
		});
		const event = {
			keyCode: 13,
		};
		component.searchViolations(event, 'input');
		expect(component.invalidSearchInput)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8 and search with search input', () => {
		component.searched = false;
		component.view = 'violation';
		component.searchInput = 'PCI';
		component.searchForm = formBuilder.group({
			search: 'PCI',
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, 'clear');
		expect(component.violationGridObj.search)
			.toEqual(component.searchInput);
		component.searchViolations(event, 'input');
		fixture.detectChanges();
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8 and search type HIPAA', () => {
		component.searched = false;
		component.view = 'asset';
		component.searchInput = 'HIPAA';
		component.searchForm = formBuilder.group({
			search: 'HIPAA',
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, 'clear');
		expect(component.assetGridObj.searchParam)
			.toEqual(component.searchInput);
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8 and with empty input', () => {
		component.searched = true;
		component.view = 'violation';
		component.searchInput = '';
		component.searchForm = formBuilder.group({
			search: '',
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeFalsy();
	});

	it('should call getGridData to get empty data', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			pageIndex: 1,
			pageSize: 10,
			policyType: 'PCI',
			search: 'HIPAA',
			severity: 'P1',
		};
		spyOn(rccService, 'getGridData')
			.and
			.returnValue(of(ComplianceScenarios[10].scenarios.GET[0].response.body));
		component.getRCCData(violationGridObj);
		expect(component.noTableData)
			.toBeTruthy();
	});

	it('should call getGridData and return error', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			pageIndex: 1,
			pageSize: 10,
			policyType: 'PCI',
			search: 'HIPAA',
			severity: 'P1',
		};
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccService, 'getGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getRCCData(violationGridObj);
		expect(component.errorPolicyView)
			.toBeTruthy();
	});

	it('should call getRCCAssetData and return error', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			osType: 'IOS-XE',
			pageLimit: 10,
			pageNum: 1,
			searchParam: 'HIPAA',
			severity: 'P1',
		};
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccService, 'getAssetGridData')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getRCCAssetData(violationGridObj);
		expect(component.errorPolicyView)
			.toBeTruthy();
	});

	it('should call getFiltersData and return error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccService, 'getViolationCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getFiltersData();
		expect(component.loading)
			.toBeFalsy();
	});

	it('should call getAssetFiltersData and return error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(rccService, 'getAssetCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.getAssetFiltersData();
		expect(component.loading)
			.toBeFalsy();
	});

	it('should call getRCCAssetData and return data', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			osType: 'IOS-XE',
			pageLimit: 10,
			pageNum: 1,
			searchParam: 'HIPAA',
			severity: 'P1',
		};
		spyOn(rccService, 'getAssetGridData')
			.and
			.returnValue(of(ComplianceScenarios[12].scenarios.GET[0].response.body));
		component.getRCCAssetData(violationGridObj);
		expect(component.errorPolicyView)
			.toBeFalsy();
	});

	it('should call getRCCAssetData and return empty data', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			osType: 'IOS-XE',
			pageLimit: 10,
			pageNum: 1,
			searchParam: 'HIPAA',
			severity: 'P1',
		};
		spyOn(rccService, 'getAssetGridData')
			.and
			.returnValue(of(ComplianceScenarios[13].scenarios.GET[0].response.body));
		component.getRCCAssetData(violationGridObj);
		expect(component.noTableData)
			.toBeTruthy();
	});

	it('should open selected view', () => {
		const view = 'asset';
		component.selectedView(view);
		expect(component.isAssetView)
			.toBeTruthy();
	});

	it('should invoke searchViolations with invalid form, type search and keycode 65', () => {
		component.searched = false;
		component.searchInput = '$';
		component.search = new FormControl('$');
		component.searchForm = formBuilder.group({
			search: component.search,
		});
		const event = {
			keyCode: 65,
		};
		fixture.detectChanges();
		component.searchViolations(event, 'search');
		expect(component.invalidSearchInput)
			.toBeTruthy();
	});

	it('should invoke searchViolations with invalid form keycode 65', () => {
		component.searched = false;
		component.searchInput = '$';
		component.search = new FormControl('$');
		component.searchForm = formBuilder.group({
	 		search: component.search,
		});
		const event = {
	 		keyCode: 65,
		};
		component.searchViolations(event, 'input');
		expect(component.tableConfig.tableOffset)
			.toEqual(0);
	});

	it('should invoke with severity filter value null', () => {
		mockFilter.key = 'severity';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		}, {
			filter: 'osType',
			label: 'string',
			selected: false,
			value: 13,
		}];
		component.filters[0].selected = true;
		component.filters[0].seriesData = mockFilter.seriesData;
		fixture.detectChanges();
		component.onSubfilterSelect('severity', mockFilter, false);
		fixture.detectChanges();
		expect(component.violationGridObj.severity)
			.toBeNull();
	});

	it('should call onSubfilterSelect ', () => {
		mockFilter.key = 'policyGroup';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'policyGroup',
			label: 'string',
			selected: true,
			value: 13,
		}];
		component.onSubfilterSelect('policyGroup', mockFilter, false);
		fixture.detectChanges();
		expect(component.violationGridObj.policyType)
			.toBeNull();
	});

	it('should called on close with true', () => {
		const view = 'selectedViolationModal';
		spyOn(component, 'onPanelClose');
		component.handleHidden(true, view);
		expect(component.onPanelClose)
			.toHaveBeenCalled();
	});

	it('should called on close with false', () => {
		const view = 'selectedViolationModal';
		component.handleHidden(false, view);
		spyOn(component, 'onPanelClose');
		expect(component.onPanelClose)
			.toHaveBeenCalledTimes(0);
	});

	it('should invoke with assetOsType filter object', () => {
		mockFilter.key = 'assetOsType';
		mockFilter.selected = true;
		mockFilter.seriesData = [{
			filter: 'severity',
			label: 'string',
			selected: true,
			value: 13,
		},
		{
			filter: 'assetOsType',
			label: 'string',
			selected: true,
			value: 23,
		}];
		const osTypeFilter = {
			filter: 'assetOsType',
			label: 'string',
			selected: false,
			value: 23,
		};
		component.onSubfilterSelect(osTypeFilter, mockFilter, true);
		fixture.detectChanges();
		expect(component.assetGridObj.osType)
			.toEqual(mockFilter.seriesData[1].filter);
	});

	it('should call asset api and fetch data', () => {
		const data = [{ }, { }];
		const serialNumber = 'FCW2246E0PB';
		spyOn(assetPanelLinkService, 'getAssetLinkData')
		.and
		.returnValue(of(data));
		fixture.detectChanges();
		component.openDevicePage(serialNumber);
	});

	it('should call asset api and return error response', () => {
		const serialNumber = 'FCW2246E0PB';
		component.openDevicePage(serialNumber);
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(assetPanelLinkService, 'getAssetLinkData')
		.and
		.returnValue(throwError(new HttpErrorResponse(error)));
		fixture.detectChanges();
		component.openDevicePage(serialNumber);
	});
});
