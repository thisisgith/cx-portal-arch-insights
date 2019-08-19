import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationColumnChartComponent } from './risk-mitigation-column-chart.component';
import { RiskMitigationColumnChartModule } from './risk-mitigation-column-chart.module';
import { MicroMockModule } from '@cui-x-views/mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { user } from '@mock';

fdescribe('RiskMitigationColumnChartComponent', () => {
	let component: RiskMitigationColumnChartComponent;
	let fixture: ComponentFixture<RiskMitigationColumnChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RiskMitigationColumnChartModule,
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
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskMitigationColumnChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.seriesData = [
			{
			  filter: 'Time: Last 24h',
			  label: '24h',
			  selected: true,
			  value: 4,
			},
			{
			  filter: 'Time: Last 7d',
			  label: '7d',
			  selected: false,
			  value: 3,
			},
			{
			  filter: 'Time: Last 30d',
			  label: '30d',
			  selected: false,
			  value: 2,
			},
			{
			  filter: 'Time: Last 90d',
			  label: '90d',
			  selected: false,
			  value: 9,
			},
		  ];
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should should call buildGraph', () => {
		component.ngOnInit();
		expect(component.buildGraph)
		.toHaveBeenCalled();
	});

	it('should push seriesdata to plot the chart', () => {
		component.ngOnInit();
		component.buildGraph();
		expect(component.chart)
		.toBeDefined();
	});

});
