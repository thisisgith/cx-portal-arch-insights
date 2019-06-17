import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBubbleChartComponent } from './assets-bubble-chart.component';
import { AssetsBubbleChartModule } from './assets-bubble-chart.module';

describe('AssetsBubbleChartComponent', () => {
	let component: AssetsBubbleChartComponent;
	let fixture: ComponentFixture<AssetsBubbleChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsBubbleChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsBubbleChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
