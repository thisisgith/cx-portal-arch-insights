import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnChartComponent } from './column-chart.component';
import { ColumnChartModule } from './column-chart.module';

describe('ColumnChartComponent', () => {
	let component: ColumnChartComponent;
	let fixture: ComponentFixture<ColumnChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ColumnChartModule],
		})
		.compileComponents();
	}));

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
