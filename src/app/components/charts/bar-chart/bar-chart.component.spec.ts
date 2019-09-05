import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { BarChartModule } from './bar-chart.module';

describe('BarChartComponent', () => {
	let component: BarChartComponent;
	let fixture: ComponentFixture<BarChartComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [BarChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BarChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
