import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BubbleChartComponent } from './bubble-chart.component';
import { BubbleChartModule } from './bubble-chart.module';

describe('BubbleChartComponent', () => {
	let component: BubbleChartComponent;
	let fixture: ComponentFixture<BubbleChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [BubbleChartModule],
		})
		.compileComponents();
	}));

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
