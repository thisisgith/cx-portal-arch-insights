import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnChartComponent } from './column-chart.component';
import { ColumnChartModule } from './column-chart.module';

describe('ColumnChartComponent', () => {
	let component: ColumnChartComponent;
	let fixture: ComponentFixture<ColumnChartComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [ColumnChartModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ColumnChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
