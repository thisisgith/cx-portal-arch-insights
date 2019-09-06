import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BubbleChartComponent } from './bubble-chart.component';
import { BubbleChartModule } from './bubble-chart.module';

describe('BubbleChartComponent', () => {
	let component: BubbleChartComponent;
	let fixture: ComponentFixture<BubbleChartComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [BubbleChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BubbleChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
