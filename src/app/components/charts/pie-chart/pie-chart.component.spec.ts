import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
import { PieChartModule } from './pie-chart.module';

describe('PieChartComponent', () => {
	let component: PieChartComponent;
	let fixture: ComponentFixture<PieChartComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [PieChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PieChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
