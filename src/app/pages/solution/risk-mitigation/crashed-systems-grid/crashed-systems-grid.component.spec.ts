import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrashedSystemsGridComponent } from './crashed-systems-grid.component';

import { user, RiskScenarios } from '@mock';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RiskMitigationService } from '@sdp-api';
import { configureTestSuite } from 'ng-bullet';
import { CrashedSystemsGridModule } from './crashed-systems-grid.module';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';

describe('CrashedSystemsGridComponent', () => {
	let component: CrashedSystemsGridComponent;
	let fixture: ComponentFixture<CrashedSystemsGridComponent>;
	let crashRiskGridService: RiskMitigationService;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [CrashedSystemsGridComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		// I18n.injectDictionary(enUSJson);
		crashRiskGridService = TestBed.get(RiskMitigationService);
		fixture = TestBed.createComponent(CrashedSystemsGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CrashedSystemsGridModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [RiskMitigationService,
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
		});
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('Implement Pagination for CrashSystems', () => {
		const pageInfo = {
			limit: 10,
			page: 1,
		};
		component.onPagerUpdated(pageInfo);
		expect(component.first)
		.toBe(11);
	});

	it('Should get the device details', () => {
		spyOn(crashRiskGridService, 'getDeviceDetails')
		.and
		.returnValue(of(RiskScenarios[2].scenarios.GET[0].response.body));
		component.getCrashedSystemDetails();
		fixture.detectChanges();
		expect(component.crashedSystemsGridDetails.tableData)
				.toBeDefined();

	});

	it('should close the panal', () => {
		spyOn(crashRiskGridService, 'getDeviceDetails')
			.and
			.returnValue(of(RiskScenarios[0].scenarios.GET[0].response.body));
		fixture.detectChanges();
		component.onPanelClose();
		expect(component.selectedSystem)
			.toBeNull();
	});
	it('should change status on Onchanges', () => {
		const fetchDataSpy = spyOn(component, 'getCrashedSystemDetails');
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		component.ngOnChanges(changes);
		expect(fetchDataSpy)
			.toHaveBeenCalled();
	});
});
