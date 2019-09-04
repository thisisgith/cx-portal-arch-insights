import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

	it('should select a subfilter', (done) => {
		component.seriesData = [{
			label: 'test',
			value: 10,
		}];
		component.subfilter.subscribe((filter) => {
			expect(filter).toEqual({
				label: 'test',
				value: 10,
			});
			done();
		});
		component.selectSubfilter({
			point: {
				name: 'test',
			},
			stopPropagation: () => {},
		});
	});
});
