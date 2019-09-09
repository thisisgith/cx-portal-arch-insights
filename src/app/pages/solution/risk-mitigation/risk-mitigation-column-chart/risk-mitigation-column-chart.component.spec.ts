import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RiskMitigationColumnChartComponent } from './risk-mitigation-column-chart.component';
import { RiskMitigationColumnChartModule } from './risk-mitigation-column-chart.module';
import { MicroMockModule } from '@cui-x-views/mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { user } from '@mock';

describe('RiskMitigationColumnChartComponent', () => {
	let component: RiskMitigationColumnChartComponent;
	let fixture: ComponentFixture<RiskMitigationColumnChartComponent>;

	configureTestSuite(() => {
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
		});
	});

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

	it('should call buildGraph if seriesData is present', () => {
		component.seriesData = [];
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.chart)
			.toBeDefined();
	});

	it('should not build graph if seriesData is not present', () => {
		component.seriesData = undefined;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.chart)
			.toBeUndefined();
	});

	it('should emit subfilter on subfilter select', () => {
		spyOn(component.subfilter, 'emit');
		component.selectSubfilter(new Event('MouseEvent'));
		fixture.detectChanges();
		expect(component.subfilter.emit)
			.toHaveBeenCalled();
	});

	it(' build graph should be called if the seriesData change', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		component.ngOnChanges({
			resetChart: {
				currentValue: undefined,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
			seriesData: {
				currentValue: [{ test : 'test' }],
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(1);
	}));

	it(' build graph should be called if the resetChart change', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		component.ngOnChanges({
			resetChart: {
				currentValue: true,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
			seriesData: {
				currentValue: [{ test: 'test' }],
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(1);
	}));

	it('should call buildgraph on firstChange', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		component.ngOnChanges({
			resetChart: {
				currentValue: undefined,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
			seriesData: {
				currentValue: [{ test: 'test' }],
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(1);
	}));
});
