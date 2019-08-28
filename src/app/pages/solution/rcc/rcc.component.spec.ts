import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RccComponent } from './rcc.component';
import { RccModule } from './rcc.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { of } from 'rxjs';
import { user, ComplianceScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { RccService, Filter } from '@sdp-api';

describe('RccComponent', () => {
	let component: RccComponent;
	let fixture: ComponentFixture<RccComponent>;
	let rccService: RccService;
	const mockFilter: Filter = Object.create({ });

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
	it('should get the violation grid data success', done => {
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
				done();
			});
	});

	it('Should get the violation asset grid data success', done => {
		spyOn(rccService, 'getAssetGridData')
			.and
			.returnValue(of(ComplianceScenarios[1].scenarios.GET[0].response.body));
		component.selectedAssetView(component.view);
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.tableAssetData)
					.toBeDefined();
				done();
			});
	});

	it('Should get the selected violation details', done => {
		spyOn(rccService, 'getRccPolicyRuleDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.impactedAssetDetails)
					.toBeDefined();
				done();
			});
	});

	it('Should get the selected asset details', done => {
		spyOn(rccService, 'getRccViolationDetailsData')
			.and
			.returnValue(of(ComplianceScenarios[3].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.policyRuleData)
					.toBeDefined();
				done();
			});
	});

	it('Should return the violation filter data', done => {
		spyOn(rccService, 'getViolationCount')
			.and
			.returnValue(of(ComplianceScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.filterObj)
					.toBeDefined();
				done();
			});
	});

	it('Should return the asset filter data', done => {
		spyOn(rccService, 'getAssetCount')
			.and
			.returnValue(of(ComplianceScenarios[5].scenarios.GET[0].response.body));
		component.selectedAssetView(component.view);
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.assetFilterObj)
					.toBeDefined();
				done();
			});
	});

	it('should fetch selected row details on click of violation grid row', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const violationInfo = { };
				component.onViolationRowClicked(violationInfo);
				expect(component.policyViolationInfo)
					.toBeTruthy();
				done();
			});
	});

	it('should fetch selected row details on click of asset grid row', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const assetInfo = { };
				component.onAssetRowClicked(assetInfo);
				expect(component.selectedAssetData)
					.toBeTruthy();
				done();
			});
	});

	it('on violation grid pagination selection', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const pageInfo = { };
				component.onPagerUpdated(pageInfo);
				expect(component.tableConfig)
					.toBeTruthy();
				done();
			});
	});

	it('on asset grid pagination selection', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const pageInfo = { };
				component.onAssetPagerUpdated(pageInfo);
				expect(component.tableConfig)
					.toBeTruthy();
				done();
			});
	});

	it('on asset view selection', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'asset';
				component.selectedAssetView(view);
				fixture.detectChanges();
				expect(component.tableConfig)
					.toBeTruthy();
				done();
			});
	});

	it('should open asset view', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'asset';
				component.selectedView(view);
				expect(component.selectedView)
					.toBeTruthy();
				done();
			});
	});

	it('should open violation view', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const view = 'violation';
				component.selectedView(view);
				expect(component.selectedView)
					.toBeTruthy();
				done();
			});
	});

	it('should clear all the selected filters', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				component.clearFilters();
				expect(component.filtered)
					.toBeFalsy();
				done();
			});
	});

	it('should search in violation grid data if', done => {
		const tableCofig = {
			tableLimit: 10,
			tableOffset: 0,
			totalItems: 15,
		};
		const event = {
			keyCode: 13,
		};
		component.searchInput = 'sample';
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				component.searchViolations(event);
				expect(event.keyCode)
					.toEqual(13);
				expect(component.violationGridObj.search)
					.toEqual(component.searchInput);
				expect(component.tableConfig)
					.toEqual(tableCofig);
				done();
			});
	});

	it('should search in violation grid data else', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const keyCode = 11;
				component.searchViolations(keyCode);
				expect(component.violationGridObj.search)
					.toBeFalsy();
				done();
			});
	});

	it('should open the slider', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const selData = { };
				component.openSlider(selData);
				expect(component.selRowData)
					.toBeTruthy();
				done();
			});
	});

	it('should close the panel', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const model = 'selectedModel';
				component.onPanelClose(model);
				expect(component.selRowData)
					.toBeTruthy();
				done();
			});
	});

	it('should get the selected sub filters list', done => {
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				const key = '';
				component.getSelectedSubFilters(key);
				expect(component.filters)
					.toBeTruthy();
				done();
			});
	});

	it('should clear the filters on clear button if', done => {
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
		done();
	});
});