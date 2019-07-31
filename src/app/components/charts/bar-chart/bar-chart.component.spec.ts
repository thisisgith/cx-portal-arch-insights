import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { BarChartModule } from './bar-chart.module';

describe('BarChartComponent', () => {
	let component: BarChartComponent;
	let fixture: ComponentFixture<BarChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [BarChartModule],
		})
		.compileComponents();
	}));

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
