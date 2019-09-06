import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssetTimelineChartComponent } from './asset-timeline-chart.component';
import { AssetTimelineChartModule } from './asset-timeline-chart.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVScenarios } from '@mock';
import * as _ from 'lodash-es';
import { MicroMockModule } from '@cui-x-views/mock';

describe('AssetTimelineChartComponent', () => {
	let component: AssetTimelineChartComponent;
	let fixture: ComponentFixture<AssetTimelineChartComponent>;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTimelineChartModule,
				HttpClientTestingModule,
				MicroMockModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTimelineChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build graph on OnInit only if data is not null', () => {
		spyOn(component, 'buildGraph');
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.chart)
			.toBeUndefined();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(0);
	});

	it('should build graph on OnInit', () => {
		component.data = <any> OSVScenarios[3].scenarios.GET[0].response.body;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.chart)
			.toBeDefined();
	});

	it(' build graph should be called if the assetRecommendations change', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		const assetRecommendations = <any> OSVScenarios[3].scenarios.GET[0].response.body;
		component.ngOnChanges({
			assetDetails: {
				currentValue: assetRecommendations,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick(500);
		fixture.detectChanges();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(1);
		component.ngOnChanges({
			fullscreen: {
				currentValue: true,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick(500);
		fixture.detectChanges();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(2);
	}));

	it('format graph data for timeline', () => {
		component.data = _.cloneDeep(<any> OSVScenarios[3].scenarios.GET[0].response.body);
		const formattedData = component.formatGraphData();
		expect(_.get(formattedData, ['0', 'x']))
			.toBeDefined();
	});
});
