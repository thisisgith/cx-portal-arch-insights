import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssetTimelineChartComponent } from './asset-timeline-chart.component';
import { AssetTimelineChartModule } from './asset-timeline-chart.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { OSVScenarios } from '@mock';

describe('AssetTimelineChartComponent', () => {
	let component: AssetTimelineChartComponent;
	let fixture: ComponentFixture<AssetTimelineChartComponent>;
	let osvService: OSVService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTimelineChartModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTimelineChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build graph on OnInit', () => {
		spyOn(component, 'buildGraph');
		component.data = <any>OSVScenarios[3].scenarios.GET[0].response.body;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.buildGraph).toHaveBeenCalledTimes(1);
	});

	it(' build graph should be called if the assetRecommendations change', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		const assetRecommendations = <any>OSVScenarios[3].scenarios.GET[0].response.body;
		component.ngOnChanges({
			assetDetails: {
				currentValue: assetRecommendations,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			}
		});
		tick(500);
		fixture.detectChanges();
		expect(component.buildGraph).toHaveBeenCalledTimes(1);
	}));

	it(' build graph should be called if the fullScreen parameter changes', fakeAsync(() => {
		spyOn(component, 'buildGraph');
		const assetRecommendations = <any>OSVScenarios[3].scenarios.GET[0].response.body;
		component.ngOnChanges({
			fullscreen: {
				currentValue: true,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			}
		});
		tick(500);
		fixture.detectChanges();
		expect(component.buildGraph).toHaveBeenCalledTimes(1);
	}));	
});
