import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTimelineChartComponent } from './asset-timeline-chart.component';
import { AssetTimelineChartModule } from './asset-timeline-chart.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssetTimelineChartComponent', () => {
	let component: AssetTimelineChartComponent;
	let fixture: ComponentFixture<AssetTimelineChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTimelineChartModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
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
});
