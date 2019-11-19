import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { CrashRiskGridComponent } from './crash-risk-grid.component';
import { CrashRiskGridModule } from './crash-risk-grid.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HighCrashRiskPagination, RiskMitigationService } from '@sdp-api';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user, RiskScenarios } from '@mock';

describe('CrashRiskGridComponent', () => {
	let component: CrashRiskGridComponent;
	let fixture: ComponentFixture<CrashRiskGridComponent>;
	let crashRiskGridService: RiskMitigationService;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [CrashRiskGridComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		crashRiskGridService = TestBed.get(RiskMitigationService);
		fixture = TestBed.createComponent(CrashRiskGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CrashRiskGridModule,
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
	it('Should get the High Crash Risk devices grid data', () => {
		spyOn(crashRiskGridService, 'getFingerPrintDeviceDetailsData')
			.and
			.returnValue(of(RiskScenarios[4].scenarios.GET[0].response.body));
		const test: HighCrashRiskPagination = {
			customerId: 2431199 ,
			globalRiskRank: 'IBN',
			limit : 10,
			page: 0,
			search: 'Cisco',
			size: 10,
			solution: 'IBN',
			sort: 'asc',
			useCase: 'Campus Network',
		};
		component.getFingerPrintDeviceDetails(test);

		fixture.detectChanges();
		expect(component.highCrashRiskSystemsGridDetails.tableData)
			.toBeDefined();
	});
	it('should initialize the values and parameter to be called ', () => {
		const changes: SimpleChanges = {
			selectedFilter: new SimpleChange({ }, { selectedFilter: 'Success' }, false),
			selectedSolution: new SimpleChange({ }, { selectedSolution: 'Success' }, false),
			selectedTechnology: new SimpleChange({ }, { selectedTechnology: 'Success' }, false),
			serchQuery: new SimpleChange({ }, { serchQuery: 'Success' }, false),
		};
		component.ngOnChanges(changes);

		expect(component.highCrashRiskParams)
			.toBeDefined();
	});

});
