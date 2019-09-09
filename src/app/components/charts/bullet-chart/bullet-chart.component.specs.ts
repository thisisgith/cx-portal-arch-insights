import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulletChartComponent } from './bullet-chart.component';
import { BulletChartModule } from './bullet-chart.module';
import { Chart } from 'angular-highcharts';
import { By } from '@angular/platform-browser';

describe('BulletChartComponent', () => {
	let component: BulletChartComponent;
	let fixture: ComponentFixture<BulletChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BulletChartComponent],
			imports: [BulletChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BulletChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call buildGraph on valid seriesData', () => {
		component.seriesData = {
			target: 1000, xLabel: 'Network Devices', y: 850,
		};
		component.ngOnInit();
		expect(component.buildGraph)
			.toHaveBeenCalled();
		expect(component.chart)
			.toBeDefined();
	});

	it('should not call buildGraph on null seriesData', () => {
		component.seriesData = undefined;
		component.ngOnInit();
		expect(component.buildGraph)
			.toHaveBeenCalledTimes(0);
	});

	it('should define chart on buildGraph call', () => {
		component.buildGraph();
		expect(component.chart)
			.toBeDefined();
		expect(component.chart instanceof Chart)
			.toBeTruthy();
	});

	it('should define template on buildGraph call', () => {
		const bulletDiv = fixture.debugElement.query(By.css('div'));
		component.buildGraph();
		expect(bulletDiv.nativeElement.chart)
			.toBeDefined();
	});
});
