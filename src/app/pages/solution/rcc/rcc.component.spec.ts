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
import { FormBuilder } from '@angular/forms';

describe('RccComponent', () => {
	let component: RccComponent;
	let fixture: ComponentFixture<RccComponent>;
	let rccService: RccService;
	const mockFilter: Filter = Object.create({ });
	const formBuilder: FormBuilder = new FormBuilder();

	beforeEach(async(() => {
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
		})
			.compileComponents();
		rccService = TestBed.get(RccService);
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
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const violationInfo = { };
				component.onViolationRowClicked(violationInfo);
				expect(component.policyViolationInfo)
					.toBeTruthy();
			});
	});

	it('should fetch selected row details on click of asset grid row', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const assetInfo = { };
				component.onAssetRowClicked(assetInfo);
				expect(component.selectedAssetData)
					.toBeTruthy();
			});
	});

	it('on violation grid pagination selection', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const pageInfo = { };
				component.onPagerUpdated(pageInfo);
				expect(component.tableConfig)
					.toBeTruthy();
			});
	});

	it('on asset grid pagination selection', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const pageInfo = { };
				component.onAssetPagerUpdated(pageInfo);
				expect(component.tableConfig)
					.toBeTruthy();
			});
	});

	it('on asset view selection', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'asset';
				component.selectedAssetView(view);
				fixture.detectChanges();
				expect(component.tableConfig)
					.toBeTruthy();
			});
	});

	it('should open asset view', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'asset';
				component.selectedView(view);
				expect(component.selectedView)
					.toBeTruthy();
			});
	});

	it('should open violation view', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'violation';
				component.selectedView(view);
				expect(component.selectedView)
					.toBeTruthy();
			});
	});

	it('should clear all the selected filters', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				component.clearFilters();
				expect(component.filtered)
					.toBeFalsy();
			});
	});

	it('should search in violation grid data if', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
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
	});

	it('should search in violation grid data else', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const keyCode = 11;
				component.searchViolations(keyCode, null);
				expect(component.violationGridObj.search)
					.toBeFalsy();
			});
	});

	it('should invoke clearSearchInput method', () => {
		component.searchInput = '';
		spyOn(component, 'searchViolations');
		component.clearSearchInput();
		fixture.detectChanges();
		expect(component.searchViolations)
			.toHaveBeenCalled();
	});

	it('should open the slider', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const selData = { };
				component.openSlider(selData);
				expect(component.selRowData)
					.toBeTruthy();
			});
	});

	it('should close the panel', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const model = 'selectedModel';
				component.onPanelClose(model);
				expect(component.selRowData)
					.toBeTruthy();
			});
	});

	it('should get the selected sub filters list', () => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const key = '';
				component.getSelectedSubFilters(key);
				expect(component.filters)
					.toBeTruthy();
			});
	});

	it('should clear the filters on clear button if', () => {
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
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 13', () => {
		component.searched = false;
		component.searchForm = formBuilder.group({
			search: 'PCI',
		});
		const event = {
			keyCode: 13,
		};
		component.searchViolations(event, 'input');
		expect(component.searched)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8 and search type', () => {
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
	});

	it('should invoke searchViolations with keycode 8 and search type PCI', () => {
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
	});

	it('should invoke searchViolations with keycode 8 and search type null', () => {
		component.searched = true;
		component.view = 'violation';
		component.searchInput = 'PCI';
		component.searchForm = formBuilder.group({
			search: 'PCI',
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeTruthy();
	});

	it('should invoke searchViolations with keycode 8 and search type asset', () => {
		component.searched = true;
		component.view = 'asset';
		component.searchInput = 'PCI';
		component.searchForm = formBuilder.group({
			search: 'PCI',
		});
		const event = {
			keyCode: 8,
		};
		component.searchViolations(event, null);
		expect(component.searched)
			.toBeTruthy();
	});

	it('should call getGridData to get empty data', () => {
		const violationGridObj = {
			criteria: '',
			customerId: '7293498',
			pageLimit: 10,
			pageNum: 1,
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
			pageLimit: 10,
			pageNum: 1,
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

	it('Should invoke onTableSortingChanged and assign tableOffset to 0', () => {
		component.onTableSortingChanged();
		expect(component.tableConfig.tableOffset)
			.toBe(0);
	});
});
